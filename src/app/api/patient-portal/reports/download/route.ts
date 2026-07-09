import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getSecureActiveProfileId } from '@/utils/profile'

const DEFAULT_REPORT_BUCKET = process.env.REPORTS_STORAGE_BUCKET
  || process.env.SUPABASE_REPORTS_BUCKET
  || 'reports'
const SIGNED_URL_TTL_SECONDS = 60

type ReportRecord = {
  file_path: string
  patient_id: string
  patient_tests: RelatedTest | RelatedTest[] | null
}

type StorageTarget = {
  bucket: string
  path: string
}

type RelatedTest = {
  test_advised: string | null
  reference: string | null
}

function firstRelatedTest(value: RelatedTest | RelatedTest[] | null) {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function cleanPath(path: string) {
  return path
    .trim()
    .replace(/^\/+/, '')
    .replace(/^(?:sign|public|authenticated)\//, '')
}

function uniqueTargets(targets: StorageTarget[]) {
  const seen = new Set<string>()

  return targets.filter((target) => {
    const key = `${target.bucket}/${target.path}`

    if (seen.has(key) || !target.bucket || !target.path) {
      return false
    }

    seen.add(key)
    return true
  })
}

function parseStorageTargets(filePath: string): StorageTarget[] {
  const trimmedPath = filePath.trim()

  try {
    const url = new URL(trimmedPath)
    const marker = '/storage/v1/object/'
    const markerIndex = url.pathname.indexOf(marker)

    if (markerIndex >= 0) {
      const objectPath = cleanPath(url.pathname.slice(markerIndex + marker.length))
      const [bucket, ...pathParts] = objectPath.split('/')

      if (bucket && pathParts.length > 0) {
        return [{
          bucket,
          path: decodeURIComponent(pathParts.join('/')),
        }]
      }
    }
  } catch {
    // Not a URL; handle it as a plain storage object path below.
  }

  const cleanedPath = cleanPath(trimmedPath)
  const [firstSegment, ...pathParts] = cleanedPath.split('/')
  const targets: StorageTarget[] = []

  targets.push({
    bucket: DEFAULT_REPORT_BUCKET,
    path: cleanedPath,
  })

  if (firstSegment !== DEFAULT_REPORT_BUCKET && pathParts.length > 0) {
    targets.push({
      bucket: firstSegment,
      path: pathParts.join('/'),
    })
  }

  return uniqueTargets(targets)
}

function fileNameFromPath(path: string, fallbackName: string) {
  const fileName = path.split('/').filter(Boolean).pop()
  return fileName || `${fallbackName}.pdf`
}

function safeDownloadName(report: ReportRecord) {
  const relatedTest = firstRelatedTest(report.patient_tests)
  const reportName = relatedTest?.test_advised || relatedTest?.reference || 'wasfa-report'
  return reportName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'wasfa-report'
}

export async function GET(request: NextRequest) {
  const reportId = request.nextUrl.searchParams.get('id')

  if (!reportId) {
    return NextResponse.json({ error: 'Missing report ID' }, { status: 400 })
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) {
    return NextResponse.json({ error: 'No active profile selected' }, { status: 400 })
  }

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('file_path, patient_id, patient_tests(test_advised, reference)')
    .eq('id', reportId)
    .eq('patient_id', activeProfileId)
    .single()

  if (reportError || !report) {
    return NextResponse.json({ error: 'Report not found or unavailable' }, { status: 404 })
  }

  const typedReport = report as ReportRecord
  const storageTargets = parseStorageTargets(typedReport.file_path)

  if (storageTargets.length === 0) {
    return NextResponse.json({ error: 'Report file path is invalid' }, { status: 422 })
  }

  let signedUrl: string | null = null
  let lastError: string | undefined

  for (const storageTarget of storageTargets) {
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from(storageTarget.bucket)
      .createSignedUrl(storageTarget.path, SIGNED_URL_TTL_SECONDS, {
        download: fileNameFromPath(storageTarget.path, safeDownloadName(typedReport)),
      })

    if (signedUrlData?.signedUrl) {
      signedUrl = signedUrlData.signedUrl
      break
    }

    lastError = signedUrlError?.message
  }

  if (!signedUrl) {
    console.error('Report signed URL error:', {
      reportId,
      targets: storageTargets,
      message: lastError,
    })

    return NextResponse.json({ error: 'Failed to generate secure download link' }, { status: 500 })
  }

  return NextResponse.redirect(signedUrl)
}

'use client';

import { useState } from 'react';
import sampleAudit from '@/data/sample-audit';
import { ERROR_MESSAGES, STATUS, type Status } from '@/constants';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import JsonEditor from '@/components/dashboard/JsonEditor';
import GenerateActions from '@/components/dashboard/GenerateActions';
import HowItWorks from '@/components/dashboard/HowItWorks';
import SchemaTable from '@/components/dashboard/SchemaTable';
import DeployCard from '@/components/dashboard/DeployCard';

const PLACEHOLDER = JSON.stringify(sampleAudit, null, 2);

export default function DashboardPage() {
  const [json, setJson] = useState(PLACEHOLDER);
  const [status, setStatus] = useState<Status>(STATUS.IDLE);
  const [errorMsg, setError] = useState('');
  const [jsonError, setJsonError] = useState('');

  function validateJson(value: string) {
    try {
      JSON.parse(value);
      setJsonError('');
      return true;
    } catch (e) {
      setJsonError((e as Error).message);
      return false;
    }
  }

  async function handleGenerate() {
    if (!validateJson(json)) return;

    setStatus(STATUS.LOADING);
    setError('');

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        let msg = (err as { error?: string }).error ?? ERROR_MESSAGES.GENERATION_FAILED;
        if (res.status === 413) {
          msg = ERROR_MESSAGES.BODY_TOO_LARGE;
        } else if (res.status === 422 && Array.isArray((err as { details?: unknown }).details)) {
          msg = `${ERROR_MESSAGES.VALIDATION_FAILED}: ${(err as { details: Array<{ path: string; message: string }> }).details.map((d) => `${d.path} — ${d.message}`).join('; ')}`;
        }
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      try {
        const data = JSON.parse(json) as { domain?: string };
        const raw = data?.domain ?? 'отчет';
        const safe = String(raw).replace(/[\s\\/:*?"<>|]/g, '-').replace(/-+/g, '-') || 'audit';
        a.download = `Технический SEO-аудит — ${safe}.pdf`;
      } catch {
        a.download = 'Технический SEO-аудит.pdf';
      }
      a.click();
      URL.revokeObjectURL(url);

      setStatus(STATUS.SUCCESS);
      setTimeout(() => setStatus(STATUS.IDLE), 3000);
    } catch (err) {
      const e = err as Error;
      const isNetworkError =
        e.name === 'TypeError' ||
        e.message === 'Failed to fetch' ||
        /network|fetch|connection/i.test(e.message);
      setError(isNetworkError ? ERROR_MESSAGES.NETWORK_ERROR : e.message);
      setStatus(STATUS.ERROR);
    }
  }

  return (
    <main className="dashboard-main">
      <DashboardHeader />

      <div className="dashboard-layout">
        <div className="dashboard-card">
          <JsonEditor
            value={json}
            onChange={setJson}
            onValidate={validateJson}
            error={jsonError}
            lineCount={json.split('\n').length}
          />
          <GenerateActions
            status={status}
            jsonError={jsonError}
            onReset={() => {
              setJson(PLACEHOLDER);
              setJsonError('');
            }}
            onGenerate={handleGenerate}
            errorMsg={errorMsg}
          />
        </div>

        <div className="dashboard-sidebar">
          <HowItWorks />
          <SchemaTable />
          <DeployCard />
        </div>
      </div>
    </main>
  );
}

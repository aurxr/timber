'use client'

import { useState } from "react";
import DropBox from "../components/DropBox";
import { Leads } from "../types/leads.types";
import StatusPanel from "../components/StatusPanel"
import LeadTable from "../components/LeadTable"
import DownloadButton from "../components/DownloadButton";
import MailingTable from "../components/MailingTable";
import { getData, seperateLeads } from "../webServices/downloadLeadsCSV";


function App() {
  const name = 'TimberSync';
  const [leads, setLeads] = useState<Leads[]>([]);
  const [newLeads, setNewLeads] = useState<Leads[]>([]);
  const [oldLeads, setOldLeads] = useState<Leads[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <main className='app'>
        <header className='app-header'>
          <h1>{name}</h1>
          <p>Scrape, enrich, and export leads</p>
        </header>

        <div className='app-content'>
        <DropBox
        onUploadStart={function handleUploadStart(fileName: string) {
          setLeads([]);
          setStatus(`Processing (${fileName})`);
          setError('');
          setLoading(true);
        }} 
        onUploadSuccess={async function handleUploadSuccess(leads: Leads[], message: string) {
          const sorted = await seperateLeads(leads);
          setLeads(leads);
          setNewLeads(sorted.newLeads);
          setOldLeads(sorted.oldLeads??[]);
          setStatus(message);
          setError('');
          setLoading(false);
        }} 
        onUploadError={function handleUploadError(message: string) {
          setLeads([]);
          setStatus('Upload a CSV');
          setError(message);
          setLoading(false);

        }} />
        
        <StatusPanel status={status} error={error} loading={loading} />

        {leads.length > 0 && (
          <>
            <LeadTable newLeads={newLeads} />
            <MailingTable oldLeads={oldLeads}/>
            <DownloadButton leads={leads} />
        </>
        )}
        </div>

        <footer>&copy; 2026 {name}. All rights reserved.</footer>
      </main>

    </>
  )
}
export default App

import { useState, useEffect } from 'react';
import { Leads } from '../types/leads.types';
import { getData, download } from '../webServices/downloadLeadsCSV';

type DownloadbuttonProps = {
    leads: Leads[]
}

export function DownloadButton({ leads }: DownloadbuttonProps) {
    const [pendingMailingData, setPendingMailingData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const downloadLeads = async () => {
            try {
                const { leadsContent, mailingContent } = await getData(leads);
                download(leadsContent, 'newLeads.csv');

                if (mailingContent) {
                    setPendingMailingData(mailingContent);
                }
                if (!mailingContent) {
                    setPendingMailingData(null);
                }
            } catch (error) {
                console.error('Download of created CSVs failed', error);
            } finally {
                setLoading(false);
            }
        };
        downloadLeads();
    }, [leads]); 

    return (
        <div className="download-actions">
            <button disabled={true}>
                {loading ? 'CSV-ifying...' : 'Leads Downloaded ✓'}
            </button>

            {pendingMailingData && (
                <button
                    className="primary"
                    onClick={() => {
                        download(pendingMailingData, 'updatedMailingSheet.csv');
                        setPendingMailingData(null);
                    }}
                >
                    Download updated mailing sheet
                </button>
            )}
        </div>
    );
}
export default DownloadButton;

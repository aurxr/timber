import React, { useRef, useState } from 'react';
import { Leads } from '../types/leads.types';
import { getPromptSafety } from '../webServices/getPromptSafety';

type DropBoxProps = {
    onUploadStart: (fileName: string) => void
    onUploadSuccess: (leads: Leads[], message: string) => void
    onUploadError: (message: string) => void
}

function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

export function DropBox({
    onUploadStart,
    onUploadSuccess,
    onUploadError,
}: DropBoxProps) {
    const [dragOver, setDragOver] = useState(false);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [prompt, setPrompt] = useState<string>("");
    const textAreaPrompt = useRef<HTMLTextAreaElement | null>(null);

    function handleDrag(e: React.DragEvent<HTMLElement>) {
        e.preventDefault();
        setDragOver(true);
    }
    function handleDragLeave(e: React.DragEvent<HTMLElement>) {
        e.preventDefault();
        setDragOver(false);
    }
    function handleDrop(e: React.DragEvent<HTMLElement>) {
        e.preventDefault();
        setDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            stageFile(files[0]);
        }
        else {
            onUploadError('No files passed');
            return;
        }
    }

    function stageFile(file: File) {
        if (!file.name || !file.name.endsWith(".csv")) {
            onUploadError('File passed is not a CSV');
            return;
        }
        setStagedFile(file);
    }
    async function processFile(file: File, rawPrompt:string) {
        onUploadStart(file.name);
        setUploading(true);

        if (!rawPrompt.trim() || !rawPrompt) {
            console.warn("Prompt was not passed");
        }

        const safePrompt = await getPromptSafety(rawPrompt);

        if (!safePrompt?.systemPrompt) {
            console.warn("Prompt safety could not be verified");
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target?.result as string;
            if (!data) {
                setUploading(false);
                onUploadError('No data in file passed');
                return;
            }
            const websites: string[] = [];
            const parsed = data.split(/\r?\n/);

            for (const urls of parsed) {
                const links = urls.split(',');
                for (const link of links) {
                    const cleaned = link.trim();

                    if (cleaned) {
                        websites.push(cleaned);
                    }
                }
            }

            const requestBody: { websites: string[]; prompt?: string } = { websites };
            if (safePrompt?.systemPrompt) {
                requestBody.prompt = safePrompt.systemPrompt;
            }

            console.log("raw prompt: ", JSON.stringify(rawPrompt));
            console.log("safe prompt:", safePrompt);
            console.log("request body", JSON.stringify(requestBody))
            const response = await fetch("/api/leads", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "mode": 'same-origin'
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                setUploading(false);
                onUploadError(`Failed to process file`);
                return;
            }
            const leadInfo: Leads[] = await response.json();
            setUploading(false);
            setStagedFile(null);
            onUploadSuccess(leadInfo, 'Leads created');

        };
        reader.readAsText(file);

    }

    return (
        <section className='upload-card'>
            <h2>Upload Leads</h2>

            <label
            
                className={dragOver ? 'dropzone drag-over' : 'dropzone'}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                onDragLeave={handleDragLeave}
            >
                <div className='dropzone-title'>Drop file here or browse</div>
                <div className='dropzone-hint'>CSV of website URLs</div>
                <input type="file" accept=".csv" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                        stageFile(e.target.files[0]);
                        e.target.value = '';
                    }
                }}
                />
            </label>

            {stagedFile && (
                <div className='file-chip'>
                    <span className='file-icon'>CSV</span>
                    <div className='file-meta'>
                        <div className='file-name'>{stagedFile.name}</div>
                        <div className='file-size'>{formatSize(stagedFile.size)}</div>
                    </div>
                    <button
                        className='file-remove'
                        aria-label='Remove file'
                        disabled={uploading}
                        onClick={() => setStagedFile(null)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                        </svg>
                    </button>
                </div>
            )}

            <button
                className='upload-button'
                disabled={!stagedFile || uploading}
                onClick={() => {
                    const finalPrompt = textAreaPrompt.current?.value || "";
                    setPrompt(finalPrompt ? finalPrompt:"");
                    if (stagedFile) {
                        processFile(stagedFile, finalPrompt);
                    }
                }
                }
            >
                {uploading ? 'Uploading…' : 'Upload'}
            </button>


            <label className="prompt-header">If needed, feel free to filter what lead fields should should or shouldn't be returned below.</label>
            <label className="prompt-feilds"> Offered fields: organization name, person of contact, phone number, email, mailing address, city, state, and zip of operation, provided services, size,
                landownder, forestry, and timber access status, and business website</label>
            <textarea
                className="prompt-container"
                id="prompt-container"
                defaultValue={prompt ?? ''}
                maxLength={1750}
                ref={textAreaPrompt}
            >
            </textarea>


        </section>
    )

}
export default DropBox
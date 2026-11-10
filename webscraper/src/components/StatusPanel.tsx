type StatusPanelProps= {
    status:string;
    error:string;
    loading:boolean
}

export function StatusPanel({status, error, loading}: StatusPanelProps) {
    if(error) {
        return (
            <section className="status-panel error">
                Error: {error}
            </section>
        )
    }
    else if (status || loading) {
        return (
            <section className="status-panel status">
                {loading && <span className="spinner" aria-hidden="true" />}
                {status}
            </section>
        )
    }
}
export default StatusPanel
export default function normalizeWebsite(website:string): string {
    let cleaned = website.trim();
        if (!cleaned.startsWith('https://') && !cleaned.startsWith('http://')) {
            cleaned = `https://${cleaned}`;
        }
    const url = new URL(cleaned);

    url.hostname=url.hostname.toLowerCase();
    url.hash= "";

    if(url.pathname==="/") {
        url.pathname="";
    }
    return url.toString();
}
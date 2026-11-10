import { chromium, firefox, webkit, Browser } from 'playwright';

export async function getDriver(): Promise<Browser> {
    const options = { headless: true };

    try {
        return await chromium.launch(options);
    } catch (error) {
        console.warn('Chromium failed, trying Firefox...');
    }

    try {
        return await firefox.launch(options);
    } catch (error) {
        console.warn('Firefox failed, trying Webkit...');
    }

    try {
        return await webkit.launch(options);
    } catch (error) {
        console.warn('Webkit failed.');
    }

    throw new Error('Could not find or start a valid browser');
}

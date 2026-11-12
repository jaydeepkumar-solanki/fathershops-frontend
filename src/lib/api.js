
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(endpoint) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API base URL is not configured.");
        }

        const requestUrl = `${API_BASE_URL}${endpoint}`;

        console.log("API Request URL:", requestUrl);

        const response = await fetch(requestUrl, {
            cache: "no-store",
        });

        const result = await response.json();

        console.log("API Response Status:", response.status);
        console.log("API Response:", result);

        if (!response.ok || result.success === false) {
            throw new Error(
                result.message || "Something went wrong."
            );
        }

        return result.data;

    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
}

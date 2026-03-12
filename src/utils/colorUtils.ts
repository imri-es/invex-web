export const stringToColor = (str: string): string => {
    if (!str) return '#1677ff'; // Default blue color

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        // Make colors a little bit more visually pleasing by ensuring they aren't too bright or too dark
        // Let's keep it simple for now as requested
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
};

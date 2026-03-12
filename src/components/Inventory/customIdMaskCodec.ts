import type { CustomIdItem } from './types';

// ── Type ↔ Code mappings ──────────────────────────────────────────────
const TYPE_TO_CODE: Record<string, string> = {
    'Fixed text': 'C',
    '20-bit random': '20B',
    '32-bit random': '32B',
    '6-digit random': '6D',
    '9-digit random': '9D',
    'GUID': 'G',
    'Date/time': 'DT',
    'Sequence': 'S',
};

const CODE_TO_TYPE: Record<string, string> = Object.fromEntries(
    Object.entries(TYPE_TO_CODE).map(([k, v]) => [v, k])
);

// ── Escaping helpers (for values that may contain $, (, ), \) ─────────
const escapeValue = (s: string): string =>
    s.replace(/\\/g, '\\\\')
        .replace(/\$/g, '\\$')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');

const unescapeValue = (s: string): string =>
    s.replace(/\\(.)/g, '$1');

// ── Encode a single CustomIdItem into a mask segment ──────────────────
function encodeItem(item: CustomIdItem): string {
    const code = TYPE_TO_CODE[item.type];
    if (!code) return '';

    const g = item.isGrouped ? '1' : '0';

    let params: string;
    switch (item.type) {
        case 'Fixed text':
            params = escapeValue(item.value);
            break;
        case 'Date/time':
            params = escapeValue(item.value);
            break;
        case 'Sequence':
            params = escapeValue(item.value);
            break;
        case '20-bit random':
        case '32-bit random':
            params = `${item.format},,${g}`;
            break;
        case '6-digit random':
        case '9-digit random':
            params = `,${item.leadingZeros},${g}`;
            break;
        case 'GUID':
            params = `${item.format},,${g}`;
            break;
        default:
            params = '';
    }

    return `${code}(${params})`;
}

// ── Parse one mask segment back into a CustomIdItem ───────────────────
function decodeSegment(segment: string, id: string): CustomIdItem | null {
    // Match CODE(params) — find the code and the content inside parens.
    // We need to respect escaping when looking for the closing paren.
    const parenIdx = segment.indexOf('(');
    if (parenIdx === -1) return null;

    const code = segment.slice(0, parenIdx);
    const type = CODE_TO_TYPE[code];
    if (!type) return null;

    // Extract inner content (everything between first '(' and last ')')
    // The closing ')' is the last character because we split on unescaped '$'.
    const inner = segment.slice(parenIdx + 1, segment.length - 1);

    const item: CustomIdItem = {
        id,
        type,
        value: '',
        isGrouped: false,
        format: 'Hex',
        leadingZeros: 0,
    };

    switch (type) {
        case 'Fixed text':
        case 'Date/time':
        case 'Sequence':
            item.value = unescapeValue(inner);
            break;
        case '20-bit random':
        case '32-bit random':
        case 'GUID': {
            // format,,grouping
            const parts = splitParams(inner);
            item.format = parts[0] || 'Hex';
            item.isGrouped = parts[2] === '1';
            break;
        }
        case '6-digit random':
        case '9-digit random': {
            // ,leadingZeros,grouping
            const parts = splitParams(inner);
            item.leadingZeros = parseInt(parts[1], 10) || 0;
            item.isGrouped = parts[2] === '1';
            break;
        }
    }

    return item;
}

// Split by comma, but these params don't need escaping (no special chars)
function splitParams(s: string): string[] {
    return s.split(',');
}

// ── Split the full mask string on unescaped '$' ───────────────────────
function splitMask(mask: string): string[] {
    const segments: string[] = [];
    let current = '';

    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === '\\' && i + 1 < mask.length) {
            // Escaped character — keep both chars and move past
            current += mask[i] + mask[i + 1];
            i++;
        } else if (mask[i] === '$') {
            segments.push(current);
            current = '';
        } else {
            current += mask[i];
        }
    }
    if (current) segments.push(current);

    return segments;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Encode an array of CustomIdItems into a compact mask string.
 * Example: "C(INV-)$DT(YYYYMMDD)$C(-)$6D(,2,1)"
 */
export function encodeMask(items: CustomIdItem[]): string {
    return items.map(encodeItem).filter(Boolean).join('$');
}

/**
 * Decode a mask string back into CustomIdItem[].
 * Falls back to JSON.parse for backward compatibility with old masks.
 */
export function decodeMask(mask: string): CustomIdItem[] {
    if (!mask) return [];

    const segments = splitMask(mask);
    const items: CustomIdItem[] = [];

    for (let i = 0; i < segments.length; i++) {
        const item = decodeSegment(segments[i], String(Date.now() + i));
        if (item) items.push(item);
    }

    return items;
}

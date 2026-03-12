import type { CustomIdItem } from './types';

export const getDefaultValue = (type: string) => {
    switch (type) {
        case 'Fixed text': return 'INV';
        case 'Sequence': return '000002';
        case 'Date/time': return 'HHMMSS';
        default: return '';
    }
};

export const generateExample = (item: CustomIdItem) => {
    let result = '';
    switch (item.type) {
        case 'Fixed text':
        case 'Sequence':
            result = item.value;
            break;
        case 'Date/time':
            result = item.value
                .replace(/YYYY/g, '2026')
                .replace(/YY/g, '26')
                .replace(/MM/g, '12')
                .replace(/DD/g, '31')
                .replace(/HH/g, '23')
                .replace(/SS/g, '59');
            break;
        case '20-bit random':
            if (item.format === 'Hex') result = '3A8F2';
            else if (item.format === 'Base36') result = 'LMNP';
            else result = '845392';

            if (item.isGrouped && result.length > 3) {
                result = result.slice(0, 3) + '-' + result.slice(3);
            }
            break;
        case '32-bit random':
            if (item.format === 'Hex') result = 'A1B2C3D4';
            else if (item.format === 'Base36') result = 'XYZ1234';
            else if (item.format === 'Base62') result = 'aBcDeF';
            else result = '3892348123';

            if (item.isGrouped && result.length > 4) {
                result = result.slice(0, 4) + '-' + result.slice(4);
            }
            break;
        case '6-digit random': {
            const num = '123456';
            result = '0'.repeat(item.leadingZeros   ) + num.slice(item.leadingZeros);
            if (item.isGrouped) result = result.slice(0, 3) + '-' + result.slice(3);
            break;
        }
        case '9-digit random': {
            const num = '123456789';
            result = '0'.repeat(item.leadingZeros) + num.slice(item.leadingZeros);
            if (item.isGrouped) {
                result = result.slice(0, 3) + '-' + result.slice(3, 6) + '-' + result.slice(6);
            }
            break;
        }
        case 'GUID':
            result = '123e4567-e89b-12d3-a456-426614174000';
            if (!item.isGrouped) result = result.replace(/-/g, '');
            if (item.format === 'Uppercase') result = result.toUpperCase();
            else result = result.toLowerCase();
            break;
        default:
            result = '';
    }
    return result;
};

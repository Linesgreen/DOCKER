//возвращает ✅true если валидно, ❌false если нет
export function isValidObjectId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
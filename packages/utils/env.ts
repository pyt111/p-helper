export function isProdMode(): boolean {
  return process.env.NODE_ENV === 'production';
}

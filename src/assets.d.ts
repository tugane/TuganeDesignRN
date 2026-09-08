/**
 * Metro turns an image import into an opaque asset id (a number) at bundle
 * time. tsc knows nothing about that, so declare it.
 */
declare module '*.png' {
  const asset: number;
  export default asset;
}

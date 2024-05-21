export default function useFunctons() {
  const zeroPadding = (value: number) => {
    const result = ("000000000" + value.toString()).slice(-9);
    return result;
  };

  return {
    zeroPadding
  };
}

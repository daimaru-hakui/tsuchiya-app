export default function useFunctons() {
  const zeroPadding = (value: number) => {
    const result = ("000000000" + value.toString()).slice(-9);
    return result;
  };

  const getGender = (value: string) => {
    switch (value) {
      case "other":
        return "兼用";
      case "man":
        return "男性用";
      case "woman":
        return "女性用";
    }
  };

  return {
    zeroPadding,
    getGender,
  };
}

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

  const getTrackingLink = (tracking: string, courier: string) => {
    switch (courier) {
      case "seino":
        return `https://track.seino.co.jp/kamotsu/GempyoNoShokai.do?action=%E3%80%80%E6%A4%9C+%E7%B4%A2%E3%80%80&GNPNO1=${tracking}`;
      case "sagawa":
        return `https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${tracking}`;
      case "fukuyama":
        return `https://corp.fukutsu.co.jp/situation/tracking_no_hunt/${tracking}`;
    }
  };

  return {
    zeroPadding,
    getGender,
    getTrackingLink
  };
}

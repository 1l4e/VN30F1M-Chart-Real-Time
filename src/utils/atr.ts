function trueRange(low: number, high: number, close: number) {
    return Math.max(high - low, high - close, low - close);
  }
  
  function atrNP(tr: number[], n: number) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum = sum + tr[i];
    }
    return sum / n;
  }
  function atrWP(p: number, tr: number, n: number) {
    return (p * (n - 1) + tr) / n;
  }
  
  function rma(p: number, n: number, r1: number) {
    //p true range, n period
    let alpha = 1 / n;
    let sum = 0;
    sum = alpha * p + (1 - alpha) * r1;
    return sum;
  }
  
  function sma(p: number[], n: number) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum = sum + p[i] / n;
    }
    return sum;
  }
  
  export default function atrange(data: any) {
    let tr: number[] = [];
    data.low.forEach((e: any, i: number) => {
      let t = trueRange(
        data.low[i],
        Math.abs(data.high[i]),
        i < 1 ? Math.abs(data.close[i]) : Math.abs(data.close[i - 1])
      );
      tr.push(t);
    });
    let at: number[] = [];
  
    for (let i = 0; i < data.low.length; i++) {
      if (i < data.period) {
        let a = atrNP(tr, data.period);
        at.push(a);
      } else {
        //let a = rma(tr[i], data.period, tr[i - 1]);
        let a = atrWP(at[i-1],tr[i],data.period)
        at.push(a);
      }
    }
  
    return at;
  }
  
import atrange from "./atr";

export default function strend(values: any[], period: number, multi: number) {
  let low = values.map((val) => val[3]);
  let high = values.map((val) => val[2]);
  let close = values.map((val) => val[4]);
  let atr = atrange({
    low,
    high,
    close,
    period,
  });
  let i;
  let r = values;
  const baseUp = [];
  const baseDown = [];
  for (i = 0; i < r.length; i++) {
    let hl2 = (r[i][2] + r[i][3]) / 2;
    if (isNaN(atr[i])) {
      baseUp.push(NaN);
      baseDown.push(NaN);
      continue;
    }
    baseUp.push(hl2 + multi * atr[i]);
    baseDown.push(hl2 - multi * atr[i]);
  }
  // fiUp , fiDown
  const fiUp = [];
  const fiDown = [];
  let prevFiUp = 0;
  let prevFiDown = 0;
  for (i = 0; i < r.length; i++) {
    if (isNaN(baseUp[i])) {
      fiUp.push(NaN);
    } else {
      fiUp.push(
        baseUp[i] < prevFiUp || (r[i - 1] ? close[i - 1] : close[i]) > prevFiUp
          ? baseUp[i]
          : prevFiUp
      );
      prevFiUp = fiUp[i];
    }

    if (isNaN(baseDown[i])) {
      fiDown.push(NaN);
    } else {
      fiDown.push(
        baseDown[i] > prevFiDown ||
          (r[i - 1] ? close[i - 1] : close[i]) < prevFiDown
          ? baseDown[i]
          : prevFiDown
      );
      prevFiDown = fiDown[i];
    }
   
  }
  const st: number[] = [];
  let prevSt = NaN;
  for (i = 0; i < r.length; i++) {
    if (i < period) {
      st.push(NaN);
      continue;
    }

    let nowSt = 0;
    if (
      ((isNaN(prevSt) && isNaN(fiUp[i - 1])) || prevSt === fiUp[i - 1]) &&
      close[i] <= fiUp[i]
    ) {
        // prev = uSL-1  close <= uSL => Up trend
      nowSt = fiUp[i];
    } else if (
      ((isNaN(prevSt) && isNaN(fiUp[i - 1])) || prevSt === fiUp[i - 1]) &&
      close[i] > fiUp[i]
    ) {
        // prev stat = uSL-1 close >uSL => dao trend Down
      nowSt = fiDown[i];
    } else if (
      ((isNaN(prevSt) && isNaN(fiDown[i - 1])) || prevSt === fiDown[i - 1]) &&
      close[i] >= fiDown[i]
    ) {
        //prev = dSL-1 close >
      nowSt = fiDown[i];
    } else if (
      ((isNaN(prevSt) && isNaN(fiDown[i - 1])) || prevSt === fiDown[i - 1]) &&
      close[i] < fiDown[i]
    ) {
      nowSt = fiUp[i];
    } else {
      nowSt = fiUp[i];
    }

    st.push(nowSt);
    prevSt = st[i];
  }
  const position = [];
  for (i = 0; i < r.length; i++) {
    if (close[i] < st[i]) {
      position.push({
        time: parseFloat(r[i][0]),
        value: st[i],
        trend: "short",
        color: "#f23645"
        /* color: (close[i+1]>st[i+1])?"#4caf50": "#f23645", */
      });
     // console.log(`1 - ${parseFloat(r[i][0])} - close < SL : ${close[i]} - ${st[i]}`)
      /*  position.push({trend: 'short', value: st[i],time:values[i][0] }) */
    } else if (close[i] > st[i]) {
      position.push({
        time: parseFloat(r[i][0]),
        value: st[i],
        trend: "long",
        color: "#4caf50"
        
        /* color: (close[i+1]<st[i+1])?"#f23645": "#4caf50", */
      });
    //  console.log(`2 - ${parseFloat(r[i][0])} - close > SL : ${close[i]} - ${st[i]}`)
      /*  position.push({trend: 'long', value: st[i],time: values[i][0]}) */
    }
  }

  return position;
}

export function strend2(values: any[], period: number, multi: number) {
  let low = values.map(item=> item.low);
  let high = values.map(item=> item.high);
  let close = values.map(item=>item.close);
  let open = values.map(item=>item.open);
  let volume= values.map(item=>item.volume);
  /* let low = values.map((val) => val[3]);
  let high = values.map((val) => val[2]);
  let close = values.map((val) => val[4]); */
  let atr = atrange({
    low,
    high,
    close,
    period,
  });
  let i;
  let r = values;
  const baseUp = [];
  const baseDown = [];
  for (i = 0; i < r.length; i++) {
    let hl2 = (r[i].high + r[i].low) / 2;
    if (isNaN(atr[i])) {
      baseUp.push(NaN);
      baseDown.push(NaN);
      continue;
    }
    baseUp.push(hl2 + multi * atr[i]);
    baseDown.push(hl2 - multi * atr[i]);
  }
  // fiUp , fiDown
  const fiUp = [];
  const fiDown = [];
  let prevFiUp = 0;
  let prevFiDown = 0;
  for (i = 0; i < r.length; i++) {
    if (isNaN(baseUp[i])) {
      fiUp.push(NaN);
    } else {
      fiUp.push(
        baseUp[i] < prevFiUp || (r[i - 1] ? close[i - 1] : close[i]) > prevFiUp
          ? baseUp[i]
          : prevFiUp
      );
      prevFiUp = fiUp[i];
    }

    if (isNaN(baseDown[i])) {
      fiDown.push(NaN);
    } else {
      fiDown.push(
        baseDown[i] > prevFiDown ||
          (r[i - 1] ? close[i - 1] : close[i]) < prevFiDown
          ? baseDown[i]
          : prevFiDown
      );
      prevFiDown = fiDown[i];
    }
   
  }
  const st: number[] = [];
  let prevSt = NaN;
  for (i = 0; i < r.length; i++) {
    if (i < period) {
      st.push(NaN);
      continue;
    }

    let nowSt = 0;
    if (
      ((isNaN(prevSt) && isNaN(fiUp[i - 1])) || prevSt === fiUp[i - 1]) &&
      close[i] <= fiUp[i]
    ) {
        // prev = uSL-1  close <= uSL => Up trend
      nowSt = fiUp[i];
    } else if (
      ((isNaN(prevSt) && isNaN(fiUp[i - 1])) || prevSt === fiUp[i - 1]) &&
      close[i] > fiUp[i]
    ) {
        // prev stat = uSL-1 close >uSL => dao trend Down
      nowSt = fiDown[i];
    } else if (
      ((isNaN(prevSt) && isNaN(fiDown[i - 1])) || prevSt === fiDown[i - 1]) &&
      close[i] >= fiDown[i]
    ) {
        //prev = dSL-1 close >
      nowSt = fiDown[i];
    } else if (
      ((isNaN(prevSt) && isNaN(fiDown[i - 1])) || prevSt === fiDown[i - 1]) &&
      close[i] < fiDown[i]
    ) {
      nowSt = fiUp[i];
    } else {
      nowSt = fiUp[i];
    }

    st.push(nowSt);
    prevSt = st[i];
  }
  const position = [];
  for (i = 0; i < r.length; i++) {
    if (close[i] < st[i]) {
      position.push({
        time: parseFloat(r[i].time),
        value: st[i],
        trend: "short",
        color: "#f23645"
        /* color: (close[i+1]>st[i+1])?"#4caf50": "#f23645", */
      });
     // console.log(`1 - ${parseFloat(r[i][0])} - close < SL : ${close[i]} - ${st[i]}`)
      /*  position.push({trend: 'short', value: st[i],time:values[i][0] }) */
    } else if (close[i] > st[i]) {
      position.push({
        time: parseFloat(r[i].time),
        value: st[i],
        trend: "long",
        color: "#4caf50"
        
        /* color: (close[i+1]<st[i+1])?"#f23645": "#4caf50", */
      });
    //  console.log(`2 - ${parseFloat(r[i][0])} - close > SL : ${close[i]} - ${st[i]}`)
      /*  position.push({trend: 'long', value: st[i],time: values[i][0]}) */
    }
  }

  return position;
}

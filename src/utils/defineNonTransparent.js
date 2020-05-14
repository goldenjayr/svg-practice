// export default function defineTransparent (x, y, width, data) {
// console.log("defineTransparent -> x, y, cw, data", { x, y, width, data })

//   // const a=data[(y*width+x)*4+3];
//   // return(a>20);
// }

export const defineTransparent = data => width => (x, y) => {
  const w = Math.floor(width)
  const count = (y*w+x)*4+3
  const a = data[count];
  return(a>20);
}
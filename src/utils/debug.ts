const debug = (msg: any): void => {
  if (process.env.NODE_ENV !== "production") {
    console.log(msg);
  }
};

export default debug;

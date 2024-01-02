const getTimeLocal = (date) => {
  if (!date) {
    return 
  }
  //const timeLocal = new Date(date).toString();
  //const arrTimeLocal = timeLocal.split(' ');
  //const [month, number, year, time] = arrTimeLocal.slice(1, 5);
  // const strTimeLocal = `${month} ${number} ${year} ${time}`;

  const timeLocal = new Date(date);

  let formatter = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  // const month = timeLocal.getMonth() + 1;
  // const number = timeLocal.getDate();
  // const year = timeLocal.getFullYear();
  // const hours = timeLocal.getHours();
  // const minutes = timeLocal.getMinutes();
  // const seconds = timeLocal.getSeconds();

  // const strTimeLocal = `${month}.${
  //   number < 10 ? '0' + number : number
  // }.${year} ${hours}:${minutes < 10 ? '0' + minutes : minutes}:${
  //   seconds < 10 ? '0' + seconds : seconds
  // }`;

  return formatter.format(timeLocal);
};

export { getTimeLocal };

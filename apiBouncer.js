const howLongWeWatch = 60; 
const maxTries = 5; 
const waitIfTooMany = 60; 
const troubleMakers = {}; 
const tryCounter = {}; 

const apiBouncer = (visitor, kickThemOut, letThemIn) => {
  const theirIp = visitor.ip;
  const rightNow = Date.now();

  
  if (troubleMakers[theirIp] && troubleMakers[theirIp] > rightNow) {
    const timeLeft = Math.ceil((troubleMakers[theirIp] - rightNow) / 1000);
    console.log(`[Bouncer] IP ${theirIp} is still in timeout. Gotta wait ${timeLeft} seconds.`);
    kickThemOut.status(429).send(`Whoa there, slow down! Try again after ${timeLeft} seconds.`);
    return;
  }

  
  if (!tryCounter[theirIp]) {
    tryCounter[theirIp] = [];
  }

  
  tryCounter[theirIp] = tryCounter[theirIp].filter(
    (whenTheyTried) => rightNow - whenTheyTried < howLongWeWatch * 1000
  );

 
  if (tryCounter[theirIp].length >= maxTries) {
    const timeoutTime = (troubleMakers[theirIp] && troubleMakers[theirIp] <= rightNow)
      ? (Date.now() - (troubleMakers[theirIp] - waitIfTooMany * 1000)) / 1000 * 2 
      : waitIfTooMany;

    troubleMakers[theirIp] = rightNow + timeoutTime * 1000;
    tryCounter[theirIp] = []; 
    console.log(`[Bouncer] Blocked IP ${theirIp} for ${timeoutTime} seconds at ${new Date(rightNow).toISOString()}`);
    kickThemOut.status(429).send(`Hold on there, partner! You're doin' too much. Take a breather and try again after ${timeoutTime} seconds.`);
    return;
  }

 
  tryCounter[theirIp].push(rightNow);
  letThemIn(); 
};

module.exports = apiBouncer;




let FamilyTree = require('./family-tree');

let t = new FamilyTree({ name: "Family Tree" });

let robin = t.Person({ name: 'robin' });
let hildur = t.Person({ name: 'hildur' }).marries(robin);
let albert = t.Person({ name: 'albert' });
let betty = t.Person({ name: 'betty' }).marries(albert);
let kathy = t.Person({ name: 'kathy' }).isBorn(hildur, robin);
let janice = t.Person({ name: 'janice' }).isBorn(hildur, robin);
let ron = t.Person({ name: 'ron' }).isBorn(albert, betty).marries(kathy);
let russ = t.Person({ name: 'russ' }).isBorn(albert, betty);
let rob = t.Person({ name: 'rob' }).isBorn(ron, kathy, { date: new Date('08/05/1963') });
let helen = t.Person({ name: 'helen' }).marries(rob, { date: new Date('08/06/1994') });
let heather = t.Person({ name: 'heather' }).marries(rob);
let eden = t.Person({name: 'eden'}).isBorn(rob, heather)
let anna = t.Person({ name: 'anna' }).isBorn(rob, helen, { date: new Date('09/09/1996') });
let alyssa = t.Person({ name: 'alyssa' }).isBorn(rob, helen, { date: new Date('01/20/2000') });

//console.log('Anna\'s Ancestors: ' + JSON.stringify(anna.ancestors(), null, 2));
//console.log('Anna\'s Siblings: ' + JSON.stringify(anna.siblings(), null, 2));
console.log('Alyssa\'s Siblings: ' + JSON.stringify(alyssa.siblings(), null, 2));
console.log('Robins\'s Descendants: ' + JSON.stringify(robin.descendants(), null, 2));

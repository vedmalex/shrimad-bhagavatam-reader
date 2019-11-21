import { converter, mapper, transliterations } from 'convert-sanskrit-to-rus';

var replacer = mapper(
  [transliterations.Unicode.index],
  transliterations.flat.index,
);

export default converter(replacer);

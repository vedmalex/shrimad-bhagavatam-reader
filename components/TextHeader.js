import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { TextToolTip } from './TextToolTip';
export const TextHeader = ({ text, config }) => (
  <Tooltip title={<TextToolTip text={text} config={config} />}>
    <Typography variant="h6"> Текст {text.text.join('—')}</Typography>
  </Tooltip>
);

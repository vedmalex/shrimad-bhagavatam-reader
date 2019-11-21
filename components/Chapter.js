import { Typography, Card, CardContent, Tooltip } from '@material-ui/core';
import { ChapterTooltip } from './ChapterTooltip';
import { Text } from './Text';
export const Chapter = ({ result, config }) => (
  <>
    <Typography variant="subtitle2"></Typography>
    <Tooltip title={<ChapterTooltip chapter={result} />}>
      <Typography variant="h4">
        Глава {result.number} "{result.name}"
      </Typography>
    </Tooltip>
    {result.texts.map((t, tI) => (
      <Card>
        <CardContent>
          <Text key={tI} text={t} config={config} />
        </CardContent>
      </Card>
    ))}
  </>
);

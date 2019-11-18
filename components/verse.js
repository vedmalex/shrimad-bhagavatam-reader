export default () => (
                        <Fragment key={`${tI}wbw${wI}`}>
                          {' '}
                          <strong>{wbw[0]}</strong> - {wbw[1]}
                          {wI < t.wbw.length - 1 ? ';' : ''}
                        </Fragment>
                      ))}
                    </Typography>
                  </Fragment>
                ) : (
                  ''
                )}
                {translation ? (
                  <Fragment key={`${tI}tr`}>
                    <Typography paragraph key={`${result.name}-перевод`}>
                      <strong>{t.translation}</strong>
                    </Typography>
                  </Fragment>
                ) : (
                  ''
                )}
                {purport && t.purport ? (
                  <>
                    <Typography variant="h6" key={`${tI}-комменатарий`}>
                      Комментарий
                    </Typography>
                    <>
                      {t.purport.map((s, pI) => (
                        <Typography paragraph key={`${tI}-комментарий-${pI}`}>
                          {s}
                        </Typography>
                      ))}
                      {t.footnote ? <Typography>{t.footnote}</Typography> : ''}
                    </>
                  </>
                ) : (
                  ''
                )}
              </Fragment>
            );

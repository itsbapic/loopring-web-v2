import styled from "@emotion/styled";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  EmptyValueTag,
  FloatTag,
  getValuePrecisionThousand,
  PriceTag,
  StarHollowIcon,
  StarSolidIcon,
  TrophyIcon,
  CURRENT_EVENT_DATE,
} from "@loopring-web/common-resources";
import { Column, Table } from "../../basic-lib";
import { TablePaddingX } from "../../styled";
import { useSettings } from "@loopring-web/component-lib/src/stores";
import { useDispatch } from "react-redux";
import { Currency } from "@loopring-web/loopring-sdk";

const TableWrapperStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  ${({ theme }) =>
    TablePaddingX({ pLeft: theme.unit * 3, pRight: theme.unit * 3 })}
`;

const TableStyled = styled(Table)`
  &.rdg {
    height: ${(props: any) => {
      if (props.ispro === "pro") {
        return "620px";
      }
      if (props.currentheight && props.currentheight > 350) {
        return props.currentheight + "px";
      } else {
        return "100%";
      }
    }};

    --template-columns: ${({ ispro }: any) =>
      ispro === "pro"
        ? "240px 220px 120px"
        : "240px 220px 100px auto auto auto 132px"} !important;

    .rdg-cell.action {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .textAlignRight {
    text-align: right;

    .rdg-header-sort-cell {
      justify-content: flex-end;
    }
  }

  .textAlignCenter {
    text-align: center;
  }
` as any;

// export type QuoteTableRawDataItem = (string | number | string[] | number[])[]
export type QuoteTableRawDataItem = {
  pair: {
    coinA: string;
    coinB: string;
  };
  close: number;
  change: number;
  high: number;
  low: number;
  floatTag: keyof typeof FloatTag;
  volume: number;
};

const QuoteTableChangedCell: any = styled.span`
  color: ${({ theme: { colorBase }, upColor, value }: any) => {
    // const {theme: {colorBase}, upColor} = props
    const isUpColorGreen = upColor === "green";
    return value > 0
      ? isUpColorGreen
        ? colorBase.success
        : colorBase.error
      : value < 0
      ? isUpColorGreen
        ? colorBase.error
        : colorBase.success
      : colorBase.textPrimary;
  }};
`;

type IGetColumnModePros = {
  t: any;
  history: any;
  upColor: "green" | "red";
  handleStartClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    isFavourite: boolean,
    pair: string
  ) => void;
  favoriteMarket: string[];
  isPro: boolean;
};

const getColumnMode = (
  props: IGetColumnModePros & { currency: Currency; tradeRaceList: string[] }
): Column<QuoteTableRawDataItem, unknown>[] => {
  const {
    t: { t },
    history,
    upColor,
    handleStartClick,
    favoriteMarket,
    currency,
    isPro,
    tradeRaceList,
  } = props;
  const isUSD = currency === Currency.usd;
  const basicRender = [
    {
      key: "pair",
      name: t("labelQuotaPair"),
      sortable: true,
      formatter: ({ row }: any) => {
        const { coinA, coinB } = row["pair"];
        const pair = `${coinA}-${coinB}`;
        const isFavourite = favoriteMarket?.includes(pair);
        return (
          <Box
            className="rdg-cell-value"
            display={"flex"}
            alignItems={"center"}
            height={"100%"}
          >
            <Typography marginRight={1}>
              <IconButton
                style={{ color: "var(--color-star)" }}
                size={"large"}
                onClick={(e: any) => handleStartClick(e, isFavourite, pair)}
              >
                {isFavourite ? (
                  <StarSolidIcon cursor={"pointer"} />
                ) : (
                  <StarHollowIcon cursor={"pointer"} />
                )}
              </IconButton>
            </Typography>
            <Typography component={"span"}>
              {coinA}
              <Typography component={"span"} color={"textSecondary"}>
                /{coinB}
              </Typography>
            </Typography>
            &nbsp;
            {tradeRaceList?.includes(pair) && (
              <Box
                style={{ cursor: "pointer", paddingTop: 4 }}
                onClick={(event) => {
                  event.stopPropagation();
                  history.push(
                    `/race-event/${CURRENT_EVENT_DATE}?pair=${pair}`
                  );
                }}
              >
                <TrophyIcon />
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      key: "close",
      name: t("labelQuotaLastPrice"),
      sortable: true,
      formatter: ({ row }: any) => {
        const value = row["close"];
        const priceDollar = row["coinAPriceDollar"];
        const priceYuan = row["coinAPriceYuan"];
        const precision = row["precision"] || 6;
        const price = Number.isFinite(value)
          ? getValuePrecisionThousand(
              value,
              undefined,
              undefined,
              precision,
              true,
              { isPrice: true }
            )
          : EmptyValueTag;

        const faitPrice = Number.isFinite(value)
          ? isUSD
            ? PriceTag.Dollar +
              getValuePrecisionThousand(priceDollar, 2, 2, 2, true, {
                isFait: true,
              })
            : PriceTag.Yuan +
              getValuePrecisionThousand(priceYuan, 2, 2, 2, true, {
                isFait: true,
              })
          : EmptyValueTag;
        return (
          <div className="rdg-cell-value">
            <span>{price}</span>
            <Typography color={"var(--color-text-third)"} component={"span"}>
              {" "}
              / {faitPrice}
            </Typography>
          </div>
        );
      },
    },
    {
      key: "change",
      name: t("labelQuota24hChange"),
      // resizable: true,
      sortable: true,
      headerCellClass: "textAlignRight",
      formatter: ({ row }: any) => {
        const value = row.change;
        return (
          <div className="rdg-cell-value textAlignRight">
            <QuoteTableChangedCell value={value} upColor={upColor}>
              {typeof value !== "undefined"
                ? (row.floatTag === FloatTag.increase ? "+" : "") +
                  getValuePrecisionThousand(value, 2, 2, 2, true) +
                  "%"
                : EmptyValueTag}
            </QuoteTableChangedCell>
          </div>
        );
      },
    },
  ];
  const extraRender = [
    {
      key: "high",
      name: t("labelQuota24hHigh"),
      headerCellClass: "textAlignRight",
      // resizable: true,
      // sortable: true,
      formatter: ({ row, column }: any) => {
        const value = row[column.key];
        const precision = row["precision"] || 6;
        const price = Number.isFinite(value)
          ? getValuePrecisionThousand(
              value,
              undefined,
              undefined,
              precision,
              true,
              { isPrice: true }
            )
          : EmptyValueTag;
        return (
          <div className="rdg-cell-value textAlignRight">
            <span>{price}</span>
          </div>
        );
      },
    },
    {
      key: "low",
      name: t("labelQuota24hLow"),
      headerCellClass: "textAlignRight",
      formatter: ({ row, column }: any) => {
        const value = row[column.key];
        const precision = row["precision"] || 6;
        const price = Number.isFinite(value)
          ? getValuePrecisionThousand(
              value,
              undefined,
              undefined,
              precision,
              true,
              { isPrice: true }
            )
          : EmptyValueTag;
        return (
          <div className="rdg-cell-value textAlignRight">
            <span>{price}</span>
          </div>
        );
      },
    },
    {
      key: "volume",
      name: t("labelQuota24hAmount"),
      headerCellClass: "textAlignRight",
      // resizable: true,
      sortable: true,
      formatter: ({ row }: any) => {
        const value = row["volume"];
        const precision = row["precision"] || 6;
        const price = Number.isFinite(value)
          ? getValuePrecisionThousand(
              value,
              precision,
              undefined,
              undefined,
              true,
              { isTrade: true }
            )
          : EmptyValueTag;
        return (
          <div className="rdg-cell-value textAlignRight">
            <span>{price}</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      // resizable: true,
      headerCellClass: "textAlignCenter",
      name: t("labelQuoteAction"),
      formatter: ({ row }: any) => {
        const { coinA, coinB } = row["pair"];
        const tradePair = `${coinA}-${coinB}`;
        return (
          <div className="rdg-cell-value textAlignCenter">
            <Button
              variant="outlined"
              onClick={() =>
                history.push({
                  pathname: `/trade/lite/${tradePair}`,
                })
              }
            >
              {t("labelTrade")}
            </Button>
          </div>
        );
      },
    },
  ];
  if (isPro) {
    return [...basicRender];
  }
  return [...basicRender, ...extraRender];
};

export interface QuoteTableProps {
  rawData: QuoteTableRawDataItem[];
  rowHeight?: number;
  headerRowHeight?: number;
  onVisibleRowsChange?: (startIndex: number) => void;
  onRowClick?: (
    rowIdx: number,
    row: QuoteTableRawDataItem,
    column: any
  ) => void;
  favoriteMarket: string[];
  addFavoriteMarket: (pair: string) => void;
  removeFavoriteMarket: (pair: string) => void;
  currentheight?: number;
  showLoading?: boolean;
  isPro?: boolean;
  tradeRaceList: string[];
  // generateColumns: ({
  //                       columnsRaw,
  //                       t,
  //                       ...rest
  //                   }: { columnsRaw: readonly Column<R,unknown>[], [ key: string ]: any } & WithT) => Array<RdgColumns<R>>;
}

export type VisibleDataItem = {
  coinA: string;
  coinB: string;
};

export const QuoteTable = withTranslation("tables")(
  withRouter(
    ({
      t,
      currentheight = 350,
      rowHeight = 44,
      headerRowHeight = 44,
      onVisibleRowsChange,
      rawData,
      history,
      onRowClick,
      favoriteMarket,
      addFavoriteMarket,
      removeFavoriteMarket,
      showLoading,
      isPro = false,
      tradeRaceList,
      ...rest
    }: QuoteTableProps & WithTranslation & RouteComponentProps) => {
      let userSettings = useSettings();
      const upColor = userSettings?.upColor;
      const { currency } = userSettings;

      const dispatch = useDispatch();

      const handleStartClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        isFavourite: boolean,
        pair: string
      ): void => {
        event.stopPropagation();
        if (isFavourite) {
          dispatch(removeFavoriteMarket(pair));
        } else {
          dispatch(addFavoriteMarket(pair));
        }
      };

      const defaultArgs: any = {
        rawData: [],
        columnMode: getColumnMode({
          t: { t },
          history,
          upColor,
          handleStartClick,
          favoriteMarket,
          currency,
          isPro,
          tradeRaceList,
        }),
        generateRows: (rawData: any) => rawData,
        onRowClick: onRowClick,
        generateColumns: ({ columnsRaw }: any) =>
          columnsRaw as Column<QuoteTableRawDataItem, unknown>[],
        sortMethod: (
          sortedRows: QuoteTableRawDataItem[],
          sortColumn: string
        ) => {
          switch (sortColumn) {
            case "pair":
              sortedRows = sortedRows.sort((a, b) => {
                const valueA = a.pair.coinA;
                const valueB = b.pair.coinA;
                return valueB.localeCompare(valueA);
              });
              break;
            case "close":
              sortedRows = sortedRows.sort((a, b) => {
                const valueA = a["close"];
                const valueB = b["close"];
                if (valueA && valueB) {
                  return valueB - valueA;
                }
                if (valueA && !valueB) {
                  return -1;
                }
                if (!valueA && valueB) {
                  return 1;
                }
                return 0;
              });
              break;
            case "change":
              sortedRows = sortedRows.sort((a, b) => {
                const valueA = a["change"];
                const valueB = b["change"];
                if (valueA && valueB) {
                  return valueB - valueA;
                }
                if (valueA && !valueB) {
                  return -1;
                }
                if (!valueA && valueB) {
                  return 1;
                }
                return 0;
              });
              break;
            case "high":
              sortedRows = sortedRows.sort((a, b) => {
                const valueA = a["high"];
                const valueB = b["high"];
                if (valueA && valueB) {
                  return valueB - valueA;
                }
                if (valueA && !valueB) {
                  return -1;
                }
                if (!valueA && valueB) {
                  return 1;
                }
                return 0;
              });
              break;
            case "low":
              sortedRows = sortedRows.sort((a, b) => {
                const valueA = a["low"];
                const valueB = b["low"];
                if (valueA && valueB) {
                  return valueB - valueA;
                }
                if (valueA && !valueB) {
                  return -1;
                }
                if (!valueA && valueB) {
                  return 1;
                }
                return 0;
              });
              break;
            case "volume":
              sortedRows = sortedRows.sort((a, b) => {
                const valueA = a["volume"];
                const valueB = b["volume"];
                if (valueA && valueB) {
                  return valueB - valueA;
                }
                if (valueA && !valueB) {
                  return -1;
                }
                if (!valueA && valueB) {
                  return 1;
                }
                return 0;
              });
              break;
            default:
              return sortedRows;
          }
          return sortedRows;
        },
        sortDefaultKey: "change",
      };

      return (
        <TableWrapperStyled>
          <TableStyled
            currentheight={currentheight}
            ispro={isPro ? "pro" : "simple"}
            className={"scrollable"}
            {...{
              ...defaultArgs,
              ...rest,
              onVisibleRowsChange,
              rawData,
              rowHeight,
              headerRowHeight,
              showloading: showLoading,
            }}
          />
        </TableWrapperStyled>
      );
    }
  )
);

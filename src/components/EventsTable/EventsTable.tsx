import type { TokenEvent } from "@models/tokens";
import styles from "./EventsTable.module.css";
import { Address } from "./components/Address";

interface Props {
  events: TokenEvent[];
  isLoading: boolean;
}

export const eventTableHeaders: { key: string; label: string }[] = [
  { key: "kind", label: "Type" },
  { key: "token", label: "Token" },
  { key: "amount", label: "Amount" },
  { key: "from", label: "From / Owner" },
  { key: "to", label: "To / Spender" },
  { key: "txHash", label: "Transaction Hash" },
  { key: "blockNumber", label: "Block" },
];

export const EventsTable: React.FC<Props> = ({ events, isLoading }: Props) => {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {eventTableHeaders.map((header) => (
            <th scope="col" key={header.key}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {isLoading ? (
          <tr>
            <td colSpan={eventTableHeaders.length} className={styles.loading}>
              Loading events...
            </td>
          </tr>
        ) : (
          events.map((event) => (
            <tr key={`${event.txHash}-${event.blockNumber}`}>
              <td scope="row">{event.kind}</td>
              <td scope="row">{event.token.name}</td>
              <td scope="row">{event.readableAmount}</td>
              <td scope="row">
                <Address
                  value={event.kind === "approval" ? event.owner : event.from}
                />
              </td>
              <td scope="row">
                <Address
                  value={event.kind === "approval" ? event.spender : event.to}
                />
              </td>
              <td scope="row">
                <Address value={event.txHash} chars={6} />
              </td>
              <td scope="row">{event.blockNumber}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default EventsTable;

import { statusMeta } from "../utils/wish";

const StatusBadge = ({ status }) => {
  const meta = statusMeta(status);
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${meta.className}`}>
      {meta.label}
    </span>
  );
};

export default StatusBadge;

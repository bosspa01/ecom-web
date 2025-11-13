import React, { useEffect, useState } from 'react';
import { getAdminLogs } from '../../api/admin';
import useEcomStore from '../../store/ecom-store';

const actionsMap = {
  CREATE_PRODUCT: 'สร้างสินค้า',
  UPDATE_PRODUCT: 'แก้ไขสินค้า',
  DELETE_PRODUCT: 'ลบสินค้า',
  CREATE_COUPON: 'สร้างคูปอง',
  UPDATE_COUPON: 'แก้ไขคูปอง',
  DELETE_COUPON: 'ลบคูปอง',
  CHANGE_ROLE: 'เปลี่ยนยศผู้ใช้',
  CHANGE_STATUS: 'เปลี่ยนสถานะผู้ใช้',
  CHANGE_ORDER_STATUS: 'เปลี่ยนสถานะออเดอร์',
  CREATE_CATEGORY: 'สร้างหมวดหมู่',
  UPDATE_CATEGORY: 'แก้ไขหมวดหมู่',
  DELETE_CATEGORY: 'ลบหมวดหมู่',
};

const AdminLogs = () => {
  const token = useEcomStore((state) => state.token);
  const [logs, setLogs] = useState([]);
  const [openRows, setOpenRows] = useState({}); // track expanded state per log id
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState('');

  const fetchLogs = async (p = page, a = action) => {
    const res = await getAdminLogs(token, { page: p, limit, action: a || undefined });
    setLogs(res.data.items || []);
    setTotal(res.data.total || 0);
    setPage(res.data.page || 1);
  };

  useEffect(() => {
    if (token) fetchLogs(1, action);
  }, [token, action]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Activity Logs</h1>
        <div className="flex gap-2">
          <select value={action} onChange={(e) => setAction(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700">
            <option value="">ทั้งหมด</option>
            {Object.keys(actionsMap).map((k) => (
              <option key={k} value={k}>{actionsMap[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto bg-gray-800 rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">เวลา</th>
              <th className="px-4 py-3 text-left">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              // Build readable sentence
              const email = log.admin?.email || `admin#${log.admin?.id}`;
              // Derive label from server label, or meta snapshots as fallback
              // Ensure diff fallback for legacy meta containing before/after only
              // Robustly extract diff (handles object or JSON string)
              let diffRaw = log.meta?.diff;
              if (typeof diffRaw === 'string') {
                try { diffRaw = JSON.parse(diffRaw); } catch (_) { diffRaw = {}; }
              }
              let diff = diffRaw || {};
              if ((!diff || Object.keys(diff).length === 0) && (log.meta?.before || log.meta?.after)) {
                diff = buildDiff(log.meta.before || {}, log.meta.after || {});
              }
              const before = {}; // snapshots removed
              const after = {}; // using diff only now
              const labelFallbackByType = () => {
                switch (log.entityType) {
                  case 'COUPON': return (diff.couponCode?.after || diff.couponCode?.before) || (log.entityId ? `#${log.entityId}` : '');
                  case 'PRODUCT': return (diff.title?.after || diff.title?.before) || (log.entityId ? `#${log.entityId}` : '');
                  case 'USER': return (diff.email?.after || diff.email?.before) || (log.entityId ? `#${log.entityId}` : '');
                  case 'CATEGORY': return (diff.name?.after || diff.name?.before) || (log.entityId ? `#${log.entityId}` : '');
                  case 'ORDER': return log.entityId ? `#${log.entityId}` : '';
                  default: return log.entityId ? `#${log.entityId}` : '';
                }
              };
              const label = log.label || labelFallbackByType();
              let sentence = '';
              switch (log.action) {
                case 'CREATE_PRODUCT':
                  sentence = `${email} สร้างสินค้า ${label}`; break;
                case 'UPDATE_PRODUCT':
                  sentence = `${email} แก้ไขสินค้า ${label}`; break;
                case 'DELETE_PRODUCT':
                  sentence = `${email} ลบสินค้า ${label}`; break;
                case 'CREATE_COUPON':
                  sentence = `${email} สร้างคูปอง ${label}`; break;
                case 'UPDATE_COUPON':
                  sentence = `${email} แก้ไขคูปอง ${label}`; break;
                case 'DELETE_COUPON':
                  sentence = `${email} ลบคูปอง ${label}`; break;
                case 'CHANGE_ROLE':
                  sentence = `${email} เปลี่ยนยศผู้ใช้ ${label}`; break;
                case 'CHANGE_STATUS':
                  sentence = `${email} เปลี่ยนสถานะผู้ใช้ ${label}`; break;
                case 'CHANGE_ORDER_STATUS':
                  {
                    const oldS = diff.orderStatus?.before;
                    const newS = diff.orderStatus?.after;
                    const trans = oldS && newS ? `: ${oldS} → ${newS}` : '';
                    sentence = `${email} เปลี่ยนสถานะออเดอร์ ${label}${trans}`;
                  }
                  break;
                case 'CREATE_CATEGORY':
                  sentence = `${email} สร้างหมวดหมู่ ${label}`; break;
                case 'UPDATE_CATEGORY':
                  sentence = `${email} แก้ไขหมวดหมู่ ${label}`; break;
                case 'DELETE_CATEGORY':
                  sentence = `${email} ลบหมวดหมู่ ${label}`; break;
                default:
                  sentence = `${email} ทำรายการ ${log.action} ${label}`;
              }
              const isOpen = !!openRows[log.id];
              const toggleOpen = () => setOpenRows(r => ({ ...r, [log.id]: !isOpen }));
              return (
                <React.Fragment key={log.id}>
                  <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-300 align-top w-48">
                      <div className="flex flex-col gap-2">
                        <div>{new Date(log.createdAt).toLocaleString()}</div>
                        <button
                          onClick={toggleOpen}
                          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                        >{isOpen ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียด'}</button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-normal break-words">
                      {sentence}
                      {process.env.NODE_ENV === 'development' && isOpen && (
                        <div className="mt-2 text-[10px] text-gray-500 break-all">DEBUG meta: {safeStringify(log.meta)}</div>
                      )}
                      {isOpen && (
                        <div className="mt-3 text-xs text-gray-400 space-y-1">
                          {Object.keys(diff).length === 0 && (
                            <div className="italic text-gray-500">(ไม่มี diff ที่เปลี่ยนแปลง)</div>
                          )}
                          {Object.entries(diff).map(([field, change]) => (
                            <div key={field} className="flex flex-wrap gap-1">
                              <span className="font-medium text-gray-300">{field}:</span>
                              <span className="text-red-400 line-through">{formatValue(change.before)}</span>
                              <span className="mx-1">→</span>
                              <span className="text-green-400">{formatValue(change.after)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-400" colSpan={2}>ไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-gray-400">หน้าที่ {page} / {totalPages} (รวม {total} รายการ)</div>
        <div className="flex gap-2">
          <button disabled={page<=1} onClick={() => fetchLogs(page-1, action)} className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-50">ก่อนหน้า</button>
          <button disabled={page>=totalPages} onClick={() => fetchLogs(page+1, action)} className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-50">ถัดไป</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;

// Helper to format values for diff display (handles null/undefined, objects)
function formatValue(val) {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch (_) {
      return '[object]';
    }
  }
  return String(val);
}

// Legacy diff builder (same rules as server) for client fallback
function buildDiff(before = {}, after = {}) {
  const diff = {};
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const ignore = new Set(['id', 'createdAt', 'updatedAt']);
  for (const k of keys) {
    if (ignore.has(k)) continue;
    const b = before ? before[k] : undefined;
    const a = after ? after[k] : undefined;
    if (JSON.stringify(b) !== JSON.stringify(a)) {
      diff[k] = { before: b, after: a };
    }
  }
  return diff;
}

// Safe stringify for debug
function safeStringify(obj) {
  try { return JSON.stringify(obj); } catch (_) { return String(obj); }
}

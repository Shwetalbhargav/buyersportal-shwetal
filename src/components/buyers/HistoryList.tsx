export default function HistoryList({ buyerId }: { buyerId: string }) {
  // Fetch last 5 history items on server in page.tsx ideally; keep stub here
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Recent Changes</h3>
      <p className="text-sm text-gray-600">(History will appear here)</p>
    </div>
  );
}

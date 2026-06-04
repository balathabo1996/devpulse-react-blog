

export const PostCardSkeleton = () => {
  return (
    <article className="post-card glass" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton skeleton-img" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}></div>
      <div className="post-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="skeleton skeleton-text short" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div>
          <div className="skeleton skeleton-text short" style={{ width: '100px' }}></div>
        </div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="skeleton skeleton-avatar"></div>
            <div>
              <div className="skeleton skeleton-text" style={{ width: '120px', marginBottom: '0.25rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '80px', margin: 0, height: '0.8rem' }}></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="glass" style={{ borderRadius: "var(--radius)", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
            <th style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0 }}></div></th>
            <th style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0 }}></div></th>
            <th style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0 }}></div></th>
            <th style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0 }}></div></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0, width: '80%' }}></div></td>
              <td style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0, width: '60%' }}></div></td>
              <td style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0, width: '70%' }}></div></td>
              <td style={{ padding: "1rem" }}><div className="skeleton skeleton-text" style={{ margin: 0, width: '40%' }}></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

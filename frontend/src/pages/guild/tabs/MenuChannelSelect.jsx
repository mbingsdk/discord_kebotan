export default function MenuChannelSelect({ value, onChange, channels }) {
  const flatList = channels.flatMap(c => [c, ...(c.children || [])])
  const selectedName = flatList.find(c => c.id === value)?.name || 'Select channel'

  return (
    <div className="dropdown dropdown-bottom w-full">
      <label tabIndex={0} className="btn w-full justify-between btn-outline">
        {selectedName}
        <svg width="12" height="12" viewBox="0 0 24 24" className="inline-block ml-2">
          <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
        </svg>
      </label>

      <div
        tabIndex={0}
        className="dropdown-content z-50 w-full sm:w-80 max-h-[70vh] overflow-y-auto bg-base-100 shadow-lg rounded-box p-2"
      >
        <ul className="menu menu-sm w-full">
          {channels.map(parent => (
            <li key={parent.id} className="w-full">
              {parent.children && parent.children.length > 0 ? (
                <details className="w-full open:overflow-visible">
                  <summary
                    onClick={() => onChange(parent.id)}
                    className="cursor-pointer font-semibold"
                  >
                    {parent.name}
                  </summary>
                  <ul className="menu pl-4">
                    {parent.children.map(child => (
                      <li key={child.id}>
                        <a onClick={() => onChange(child.id)}>{child.name}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a onClick={() => onChange(parent.id)}>{parent.name}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

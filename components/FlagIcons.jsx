export function FlagUz({ className = "w-6 h-4" }) {
  const starPath = "M0,-4.5 L1.3,-1.4 L4.5,-1.4 L1.9,0.5 L2.9,3.6 L0,1.7 L-2.9,3.6 L-1.9,0.5 L-4.5,-1.4 L-1.3,-1.4Z";

  return (
    <svg
      viewBox="0 0 500 250"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Moviy tasmacha */}
      <rect width="500" height="80" fill="#0099B5" />
      
      {/* Qizil ajratuvchi */}
      <rect y="80" width="500" height="5" fill="#CE1126" />
      
      {/* Oq tasmacha */}
      <rect y="85" width="500" height="80" fill="#FFFFFF" />
      
      {/* Qizil ajratuvchi */}
      <rect y="165" width="500" height="5" fill="#CE1126" />
      
      {/* Yashil tasmacha */}
      <rect y="170" width="500" height="80" fill="#1EB53A" />
      
      {/* Yarim oy (Hilol) */}
      <circle cx="65" cy="40" r="26" fill="#FFFFFF" />
      <circle cx="73" cy="40" r="21" fill="#0099B5" />
      
      {/* 12 ta yulduz */}
      <g fill="#FFFFFF">
        {/* Yuqori qator (3 ta) */}
        <path d={starPath} transform="translate(150, 20)" />
        <path d={starPath} transform="translate(168, 20)" />
        <path d={starPath} transform="translate(186, 20)" />
        
        {/* O'rta qator (4 ta) */}
        <path d={starPath} transform="translate(132, 40)" />
        <path d={starPath} transform="translate(150, 40)" />
        <path d={starPath} transform="translate(168, 40)" />
        <path d={starPath} transform="translate(186, 40)" />
        
        {/* Quyi qator (5 ta) */}
        <path d={starPath} transform="translate(114, 60)" />
        <path d={starPath} transform="translate(132, 60)" />
        <path d={starPath} transform="translate(150, 60)" />
        <path d={starPath} transform="translate(168, 60)" />
        <path d={starPath} transform="translate(186, 60)" />
      </g>
    </svg>
  );
}

export function FlagRu({ className = "w-6 h-4" }) {
  return (
    <svg
      viewBox="0 0 300 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Oq tasmacha */}
      <rect width="300" height="66.67" fill="#FFFFFF" />
      {/* Ko'k tasmacha */}
      <rect y="66.67" width="300" height="66.67" fill="#0039A6" />
      {/* Qizil tasmacha */}
      <rect y="133.34" width="300" height="66.66" fill="#D52B1E" />
    </svg>
  );
}

import React from 'react';

const Call = () => {
  const features = [
    "1:1 Frontend & Animation Session",
  "Animated UI & Portfolio Review",
  "React + Framer Motion Animations",
  "Interactive & Scroll-Based Experiences",
  "Creative Web & 3D UI Ideas"
  ];

  return (
    <div className="w-full  max-w-sm mx-auto">
      <style>{`
        @keyframes rotate-border {
          to {
            transform: rotate(360deg);
          }
        }

        .card {
          --white: hsl(0, 0%, 100%);
          --black: hsl(240, 15%, 9%);
          --paragraph: hsl(0, 0%, 83%);
          --line: hsl(240, 9%, 17%);
          --primary: hsl(266, 92%, 58%);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 2rem;
          width: 100%;
    
          background-color: hsla(240, 15%, 9%, 1);
          background-image: radial-gradient(
            at 88% 40%,
            hsla(240, 15%, 9%, 1) 0px,
            transparent 85%
          ),
          radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
          radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
          radial-gradient(at 0% 64%, hsla(263, 70%, 35%, 1) 0px, transparent 85%),
          radial-gradient(at 41% 94%, hsla(284, 80%, 40%, 1) 0px, transparent 85%),
          radial-gradient(at 100% 99%, hsla(306, 80%, 35%, 1) 0px, transparent 85%);
          border-radius: 1rem;
          box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.15) inset;
        }

        .card .card__border {
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          z-index: -10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          background-image: linear-gradient(
            0deg,
            hsl(0, 0%, 100%) -50%,
            hsl(0, 0%, 40%) 100%
          );
          border-radius: 1rem;
        }

        .card .card__border::before {
          content: "";
          pointer-events: none;
          position: fixed;
          z-index: 200;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%), rotate(0deg);
          transform-origin: left;
          width: 200%;
          height: 10rem;
          background-image: linear-gradient(
            0deg,
            hsla(0, 0%, 100%, 0) 0%,
            hsl(277, 95%, 60%) 40%,
            hsl(277, 95%, 60%) 60%,
            hsla(0, 0%, 40%, 0) 100%
          );
          animation: rotate-border 8s linear infinite;
        }

        .card .card_title__container .card_title {
          font-size: 1rem;
          color: var(--white);
          font-weight: 600;
          font-family: 'JazzFont';
          letter-spacing: 0.05em;
        }

        .card .card_title__container .card_paragraph {
          margin-top: 0.25rem;
          width: 100%;
          font-size: 0.875rem;
          color: var(--paragraph);
          line-height: 1.4;
          font-family: 'JazzFont';
          letter-spacing: 0.05em;
        }

        .card .line {
          width: 100%;
          height: 0.1rem;
          background-color: var(--line);
          border: none;
        }

        .card .card__list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card .card__list .card__list_item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card .card__list .card__list_item .check {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: 1rem;
          background-color: var(--primary);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .card .card__list .card__list_item .check .check_svg {
          width: 0.75rem;
          height: 0.75rem;
          fill: var(--black);
        }

        .card .card__list .card__list_item .list_text {
          font-size: 0.75rem;
          color: var(--white);
        }

        .card .button {
          cursor: pointer;
          padding: 0.5rem;
          width: 100%;
          background-image: linear-gradient(
            0deg,
            rgba(94, 58, 238, 1) 0%,
            rgba(197, 107, 240, 1) 100%
          );
          font-size: 0.75rem;
          color: var(--black);
          border: 0;
          border-radius: 9999px;
          box-shadow: inset 0 -2px 25px -4px var(--white);
          transition: all 0.3s ease;
          font-weight: 600;
          font-family: 'JazzFont';
          letter-spacing: 0.05em;
        }

        .card .button:hover {
          transform: scale(1.05);
        }
      `}</style>

      <div className="card ">
        <div className="card__border" />
        <div className="card_title__container">
          <span className="card_title">30 Min Meeting</span>
          <p className="card_paragraph">
Book a 1:1 frontend consultation focused on modern UI animations, React, Framer Motion, and interactive web experiences.
          </p>
        </div>
        <hr className="line" />
        <ul className="card__list">
          {features.map((feature, index) => (
            <li key={index} className="card__list_item">
              <span className="check">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="list_text">{feature}</span>
            </li>
          ))}
        </ul>
        <a 
          href="https://cal.com/ayesha-qureshi/30min?overlayCalendar=true" 
          target="_blank" 
          rel="noopener noreferrer"
          className="button"
        >
          SCHEDULE NOW
        </a>
      </div>
    </div>
  );
};

export default Call;
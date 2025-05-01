import { useState } from 'react';
import { CONFIG } from '../config';

export default function Invite() {
  const [referralCode, setReferralCode] = useState('');
  const referralLink = `${CONFIG.baseUrl}/?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <div className="invite-container">
      <h3>Invite Friends</h3>
      <div className="referral-link">
        <input 
          type="text" 
          value={referralLink} 
          readOnly 
        />
        <button onClick={copyToClipboard}>
          Copy Link
        </button>
      </div>
      <div className="social-share">
        <a 
          href={`https://twitter.com/intent/tweet?text=Join%20me%20in%20Neon%20Lottery!%20${referralLink}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on Twitter
        </a>
        {/* Другие социальные кнопки */}
      </div>
    </div>
  );
}

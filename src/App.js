import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// AIA-branded header component
const AIAHeader = () => (
    <header className="w-full bg-[#D31145] p-4 text-white text-center shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-wider">AIA</h1>
        <p className="text-sm">LINE Business Connect</p>
    </header>
);

// Main card container for content
const Card = ({ children, className = '' }) => (
    <div className={`w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 ${className}`}>
        {children}
    </div>
);

// Styled button component
const PrimaryButton = ({ onClick, children, className = '', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-[#D31145] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#b00e39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D31145] transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
    </button>
);

// Secondary styled button component
const SecondaryButton = ({ onClick, children, className = '' }) => (
     <button
        onClick={onClick}
        className={`w-full bg-white text-[#D31145] font-bold py-3 px-4 rounded-lg border-2 border-[#D31145] hover:bg-red-50 transition-colors duration-300 ${className}`}
    >
        {children}
    </button>
);

// Styled input field component
const InputField = ({ id, label, type = 'text', value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D31145] focus:border-[#D31145] transition-colors duration-200"
        />
    </div>
);

// Styled checkbox component
const Checkbox = ({ id, label, checked, onChange, value }) => (
     <div className="flex items-center">
        <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            value={value}
            className="h-4 w-4 text-[#D31145] focus:ring-[#b00e39] border-gray-300 rounded"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
            {label}
        </label>
    </div>
);

// List item component for policies, claims, etc.
const ListItem = ({ title, description, onClick, imgSrc }) => (
    <div onClick={onClick} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
        {imgSrc && (
            <img 
                src={imgSrc} 
                alt={title} 
                className="w-16 h-16 mr-4 rounded-md object-cover flex-shrink-0"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/cccccc/ffffff?text=Error'; }}
            />
        )}
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);


// --- Screen Components ---

// 1. Welcome Screen
const WelcomeScreen = ({ setScreen }) => (
    <Card>
        <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-8">Please select an option to continue.</p>
        </div>
        <div className="space-y-4">
            <PrimaryButton onClick={() => setScreen('existing_customer_login')}>
                Existing Customer
            </PrimaryButton>
            <SecondaryButton onClick={() => setScreen('new_customer_form')}>
                New Customer
            </SecondaryButton>
        </div>
    </Card>
);

// 2a. Existing Customer Login Screen (OKTA Simulation)
const ExistingCustomerLogin = ({ setScreen, setUserData }) => (
    <Card>
        <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Existing Customer Login</h2>
            <p className="text-gray-600 mb-8">You will be redirected to log in securely.</p>
            <img 
                src="https://placehold.co/100x40/FFFFFF/000000?text=OKTA" 
                alt="OKTA Logo"
                className="mx-auto mb-8"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x40/FFFFFF/000000?text=OKTA'; }}
            />
        </div>
        <PrimaryButton onClick={() => {
            setUserData({ firstName: 'Valued Customer', isNew: false });
            setScreen('completed');
        }}>
            Login with OKTA
        </PrimaryButton>
         <button onClick={() => setScreen('welcome')} className="w-full text-center text-gray-500 mt-4 text-sm hover:underline">
            &larr; Back
        </button>
    </Card>
);

// 2b. New Customer Registration Form
const NewCustomerForm = ({ setScreen, setUserData }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', nid: '' });
    const [interests, setInterests] = useState([]);
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState('');
    const productCategories = ["Health insurance", "Life insurance", "Tax saving"];

    const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    const handleInterestChange = (e) => {
        const { value, checked } = e.target;
        setInterests(prev => checked ? [...prev, value] : prev.filter(i => i !== value));
    };

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.nid) {
            setError('All personal information fields are required.');
            return;
        }
        if (!consent) {
            setError('You must accept the PDPA consent to proceed.');
            return;
        }
        setError('');
        setUserData({ ...formData, interests, isNew: true });
        setScreen('otp');
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">New Customer Registration</h2>
            <div className="space-y-4">
                <InputField id="firstName" label="First Name" value={formData.firstName} onChange={handleFormChange} placeholder="e.g., John" />
                <InputField id="lastName" label="Last Name" value={formData.lastName} onChange={handleFormChange} placeholder="e.g., Doe" />
                <InputField id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleFormChange} placeholder="e.g., 0812345678" />
                <InputField id="nid" label="National ID (NID)" type="text" value={formData.nid} onChange={handleFormChange} placeholder="13-digit number" />
            </div>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">I'm interested in (optional)</label>
                <div className="space-y-2">
                    {productCategories.map(category => <Checkbox key={category} id={category} label={category} checked={interests.includes(category)} onChange={handleInterestChange} value={category}/>)}
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
                 <div className="flex items-start">
                    <div className="flex items-center h-5"><input id="consent" name="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-4 w-4 text-[#D31145] focus:ring-[#b00e39] border-gray-300 rounded"/></div>
                    <div className="ml-3 text-sm"><label htmlFor="consent" className="text-gray-700">This is the PDPA consent which you need to accept before proceed to next step</label></div>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            <PrimaryButton onClick={handleSubmit} className="mt-8" disabled={!consent}>Request OTP</PrimaryButton>
            <button onClick={() => setScreen('welcome')} className="w-full text-center text-gray-500 mt-4 text-sm hover:underline">&larr; Back</button>
        </Card>
    );
};

// 3. OTP Verification Screen
const OtpScreen = ({ setScreen }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = () => (otp === '999999' ? (setError(''), setScreen('completed')) : setError('Invalid OTP. Please try again.'));

    return (
        <Card>
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Enter OTP</h2>
                <p className="text-gray-600 mb-6">An OTP has been sent to your phone. (Hint: use 999999)</p>
            </div>
            <InputField id="otp" label="One-Time Password" type="tel" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code"/>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <PrimaryButton onClick={handleSubmit} className="mt-8">Verify & Complete</PrimaryButton>
            <button onClick={() => setScreen('new_customer_form')} className="w-full text-center text-gray-500 mt-4 text-sm hover:underline">&larr; Back</button>
        </Card>
    );
};

// 4. Completion Screen
const CompletedScreen = ({ setScreen, userData }) => (
    <Card>
        <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
            <p className="text-gray-600 mb-8">Thank you, {userData?.firstName || 'customer'}! You are now connected with AIA.</p>
            <div className="space-y-4">
                <PrimaryButton onClick={() => setScreen('features_menu')}>All Features</PrimaryButton>
                <SecondaryButton onClick={() => setScreen('welcome')}>Start Over</SecondaryButton>
            </div>
        </div>
    </Card>
);

// --- NEW FEATURE SCREENS ---

// 5. Features Menu
const FeaturesMenuScreen = ({ setScreen, userData }) => (
    <Card>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Features</h2>
        <div className="space-y-4">
            {userData && !userData.isNew && (
                <>
                    <ListItem title="My Policies" description="View your active insurance policies." onClick={() => setScreen('my_policies')} />
                    <ListItem title="My Claims" description="Check the status of your claims." onClick={() => setScreen('my_claims')} />
                </>
            )}
            <ListItem title="Privileges" description="Explore your eligible rewards." onClick={() => setScreen('privileges')} />
        </div>
        <button onClick={() => setScreen('welcome')} className="w-full text-center text-gray-500 mt-8 text-sm hover:underline">&larr; Back to Home</button>
    </Card>
);

// 6a. My Policies List
const MyPoliciesScreen = ({ setScreen, setSelectedPolicy }) => {
    const policies = [
        { id: 1, name: 'Health Insurance', desc: 'AIA Health Happy - Policy #74839201' },
        { id: 2, name: 'Life Insurance', desc: 'AIA 20 Pay Life (Par) - Policy #58493028' },
        { id: 3, name: 'Tax Saving', desc: 'AIA Annuity Fix - Policy #94820134' },
    ];
    return (
        <Card>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">My Policies</h2>
            <div className="space-y-4">
                {policies.map(p => <ListItem key={p.id} title={p.name} description={p.desc} onClick={() => { setSelectedPolicy(p); setScreen('policy_details'); }} />)}
            </div>
            <button onClick={() => setScreen('features_menu')} className="w-full text-center text-gray-500 mt-8 text-sm hover:underline">&larr; Back to Features</button>
        </Card>
    );
};

// 6b. Policy Details
const PolicyDetailsScreen = ({ setScreen, policy }) => (
    <Card>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">{policy.name}</h2>
        <p className="text-center text-gray-500 mb-6">{policy.desc}</p>
        <div className="space-y-3 text-sm border-t pt-6">
            <div className="flex justify-between"><span className="font-medium text-gray-600">Coverage Amount:</span><span>THB 5,000,000</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Premium:</span><span>THB 25,000 / year</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Next Due Date:</span><span>01/08/2025</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Status:</span><span className="text-green-600 font-semibold">Active</span></div>
        </div>
        <button onClick={() => setScreen('my_policies')} className="w-full text-center text-gray-500 mt-8 text-sm hover:underline">&larr; Back to My Policies</button>
    </Card>
);

// 7a. My Claims List
const MyClaimsScreen = ({ setScreen, setSelectedClaim }) => {
    const claims = [
        { id: 1, name: 'OPD Claim', desc: 'Submitted: 15/06/2025 - Status: Approved' },
        { id: 2, name: 'Accident Claim', desc: 'Submitted: 02/05/2025 - Status: Approved' },
        { id: 3, name: 'Dental Claim', desc: 'Submitted: 20/04/2025 - Status: Rejected' },
    ];
    return (
        <Card>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">My Claims</h2>
            <div className="space-y-4">
                {claims.map(c => <ListItem key={c.id} title={c.name} description={c.desc} onClick={() => { setSelectedClaim(c); setScreen('claim_details'); }} />)}
            </div>
            <button onClick={() => setScreen('features_menu')} className="w-full text-center text-gray-500 mt-8 text-sm hover:underline">&larr; Back to Features</button>
        </Card>
    );
};

// 7b. Claim Details
const ClaimDetailsScreen = ({ setScreen, claim }) => (
    <Card>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Claim Details</h2>
        <div className="space-y-3 text-sm border-t pt-6">
            <div className="flex justify-between"><span className="font-medium text-gray-600">Claim ID:</span><span>CLM-2025-06-3984</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Type:</span><span>{claim.name}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Submission Date:</span><span>15/06/2025</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Amount:</span><span>THB 1,250</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-600">Status:</span><span className="text-green-600 font-semibold">Approved</span></div>
        </div>
        <button onClick={() => setScreen('my_claims')} className="w-full text-center text-gray-500 mt-8 text-sm hover:underline">&larr; Back to My Claims</button>
    </Card>
);

// 8. Privileges
const PrivilegesScreen = ({ setScreen }) => {
    const privileges = [
        { name: 'Free coverage campaign', desc: 'Additional COVID-19 coverage until Dec 2025.', imgSrc: 'https://placehold.co/80x80/D31145/FFFFFF?text=Health' },
        { name: 'GRAB food voucher', desc: 'THB 100 voucher. Valid until 30/09/2025.', imgSrc: 'https://placehold.co/80x80/28a745/FFFFFF?text=Food' },
        { name: 'Major Cineplex voucher', desc: 'Buy 1 Get 1 Free for any movie.', imgSrc: 'https://placehold.co/80x80/ffc107/000000?text=Movie' },
    ];
    return (
        <Card>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Your Privileges</h2>
            <div className="space-y-4">
                {privileges.map(p => <ListItem key={p.name} title={p.name} description={p.desc} imgSrc={p.imgSrc} onClick={() => {}} />)}
            </div>
            <button onClick={() => setScreen('features_menu')} className="w-full text-center text-gray-500 mt-8 text-sm hover:underline">&larr; Back to Features</button>
        </Card>
    );
};


// --- Main App Component ---
export default function App() {
    const [screen, setScreen] = useState('welcome');
    const [userData, setUserData] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [selectedClaim, setSelectedClaim] = useState(null);

    const renderScreen = () => {
        switch (screen) {
            case 'existing_customer_login': return <ExistingCustomerLogin setScreen={setScreen} setUserData={setUserData} />;
            case 'new_customer_form': return <NewCustomerForm setScreen={setScreen} setUserData={setUserData} />;
            case 'otp': return <OtpScreen setScreen={setScreen} />;
            case 'completed': return <CompletedScreen setScreen={setScreen} userData={userData} />;
            case 'features_menu': return <FeaturesMenuScreen setScreen={setScreen} userData={userData} />;
            case 'my_policies': return <MyPoliciesScreen setScreen={setScreen} setSelectedPolicy={setSelectedPolicy} />;
            case 'policy_details': return <PolicyDetailsScreen setScreen={setScreen} policy={selectedPolicy} />;
            case 'my_claims': return <MyClaimsScreen setScreen={setScreen} setSelectedClaim={setSelectedClaim} />;
            case 'claim_details': return <ClaimDetailsScreen setScreen={setScreen} claim={selectedClaim} />;
            case 'privileges': return <PrivilegesScreen setScreen={setScreen} />;
            case 'welcome':
            default:
                return <WelcomeScreen setScreen={setScreen} />;
        }
    };

    return (
        <div className="font-sans bg-gray-100 min-h-screen flex flex-col items-center">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style>
            <AIAHeader />
            <main className="w-full flex-grow flex items-center justify-center p-4">
                {renderScreen()}
            </main>
        </div>
    );
}

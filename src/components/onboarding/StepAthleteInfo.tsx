import { useState } from 'react';
import { OnboardingData } from './OnboardingFlow';
import { SPORTS, getGradYearOptions } from '../../lib/utils';

interface StepAthleteInfoProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export default function StepAthleteInfo({ data, updateData, onNext }: StepAthleteInfoProps) {
    const [showSportSuggestions, setShowSportSuggestions] = useState(false);
    const gradYears = getGradYearOptions();

    const isValid = data.name.trim().length > 0 && data.sport.trim().length > 0;

    const filteredSports = SPORTS.filter(sport =>
        sport.toLowerCase().includes(data.sport.toLowerCase())
    );

    const handleSportSelect = (sport: string) => {
        updateData({ sport });
        setShowSportSuggestions(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your athlete
            </h1>
            <p className="text-gray-600 mb-8">
                This helps us personalize your recruiting experience.
            </p>

            <div className="space-y-6">
                {/* Athlete Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Athlete Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        placeholder="Alex Smith"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Graduation Year */}
                <div>
                    <label htmlFor="gradYear" className="block text-sm font-medium text-gray-700 mb-2">
                        Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="gradYear"
                        value={data.gradYear}
                        onChange={(e) => updateData({ gradYear: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        {gradYears.map(year => (
                            <option key={year} value={year}>
                                {year}{year === gradYears[gradYears.length - 1] ? '+' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Primary Sport */}
                <div className="relative">
                    <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Sport <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="sport"
                        value={data.sport}
                        onChange={(e) => {
                            updateData({ sport: e.target.value });
                            setShowSportSuggestions(true);
                        }}
                        onFocus={() => setShowSportSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSportSuggestions(false), 200)}
                        placeholder="Baseball, Softball, Soccer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        autoComplete="off"
                    />

                    {/* Sport suggestions dropdown */}
                    {showSportSuggestions && data.sport.length > 0 && filteredSports.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredSports.map(sport => (
                                <button
                                    key={sport}
                                    type="button"
                                    onClick={() => handleSportSelect(sport)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                >
                                    {sport}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Next button */}
            <div className="mt-8">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

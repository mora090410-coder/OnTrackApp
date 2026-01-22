import { useEffect } from 'react';
import { OnboardingData } from './OnboardingFlow';
import { DIVISIONS, REGIONS, getDefaultTargetCount } from '../../lib/utils';

interface StepTargetStrategyProps {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepTargetStrategy({ data, updateData, onNext, onBack }: StepTargetStrategyProps) {
    // Update default target count based on grad year
    useEffect(() => {
        const defaultCount = getDefaultTargetCount(data.gradYear);
        if (data.targetCount === 30) { // Only update if still at default
            updateData({ targetCount: defaultCount });
        }
    }, [data.gradYear]);

    const toggleLevel = (level: string) => {
        const newLevels = data.levels.includes(level)
            ? data.levels.filter(l => l !== level)
            : [...data.levels, level];
        updateData({ levels: newLevels });
    };

    const toggleRegion = (region: string) => {
        const newRegions = data.regions.includes(region)
            ? data.regions.filter(r => r !== region)
            : [...data.regions, region];
        updateData({ regions: newRegions });
    };

    const handleInStateChange = (checked: boolean) => {
        updateData({
            inStateOnly: checked,
            regions: checked ? [] : data.regions
        });
    };

    const isValid = data.levels.length > 0 && (data.inStateOnly || data.regions.length > 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Define your recruiting targets
            </h1>
            <p className="text-gray-600 mb-8">
                Help us understand what schools you're targeting.
            </p>

            <div className="space-y-8">
                {/* Division Levels */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        What levels are you targeting? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DIVISIONS.map(level => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => toggleLevel(level)}
                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${data.levels.includes(level)
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Select all that apply</p>
                </div>

                {/* Regions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        What regions? <span className="text-red-500">*</span>
                    </label>

                    {/* In-state only checkbox */}
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.inStateOnly}
                            onChange={(e) => handleInStateChange(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">In-state only</span>
                    </label>

                    {/* Region buttons (disabled if in-state only) */}
                    <div className={`flex flex-wrap gap-2 ${data.inStateOnly ? 'opacity-50 pointer-events-none' : ''}`}>
                        {REGIONS.map(region => (
                            <button
                                key={region}
                                type="button"
                                onClick={() => toggleRegion(region)}
                                disabled={data.inStateOnly}
                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${data.regions.includes(region)
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Target Count */}
                <div>
                    <label htmlFor="targetCount" className="block text-sm font-medium text-gray-700 mb-2">
                        How many target schools are you planning to contact?
                    </label>
                    <input
                        type="number"
                        id="targetCount"
                        value={data.targetCount}
                        onChange={(e) => updateData({ targetCount: Math.max(5, Math.min(100, parseInt(e.target.value) || 5)) })}
                        min={5}
                        max={100}
                        className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="mt-2 text-sm text-gray-500">Range: 5-100 schools</p>
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

import { createContext, useContext, ReactNode } from 'react';
import { useAthlete, Athlete, TargetStrategy } from '../hooks/useAthlete';

interface AthleteContextValue {
    athlete: Athlete | null;
    targetStrategy: TargetStrategy | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createAthlete: (data: {
        name: string;
        grad_year: number;
        sport: string;
        onboarding_completed?: boolean;
        targetStrategy?: {
            levels: string[];
            regions: string[] | null;
            in_state_only: boolean;
            target_count: number;
        };
    }) => Promise<Athlete | null>;
    updateAthlete: (data: Partial<Athlete>) => Promise<boolean>;
}

const AthleteContext = createContext<AthleteContextValue | undefined>(undefined);

export function AthleteProvider({ children }: { children: ReactNode }) {
    const athleteData = useAthlete();

    return (
        <AthleteContext.Provider value={athleteData}>
            {children}
        </AthleteContext.Provider>
    );
}

export function useAthleteContext(): AthleteContextValue {
    const context = useContext(AthleteContext);
    if (context === undefined) {
        throw new Error('useAthleteContext must be used within an AthleteProvider');
    }
    return context;
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Athlete {
    id: string;
    user_id: string;
    name: string;
    grad_year: number;
    sport: string;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface TargetStrategy {
    id: string;
    athlete_id: string;
    levels: string[];
    regions: string[] | null;
    in_state_only: boolean;
    target_count: number;
    created_at: string;
    updated_at: string;
}

interface UseAthleteReturn {
    athlete: Athlete | null;
    targetStrategy: TargetStrategy | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createAthlete: (data: CreateAthleteData) => Promise<Athlete | null>;
    updateAthlete: (data: Partial<Athlete>) => Promise<boolean>;
}

interface CreateAthleteData {
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
}

export function useAthlete(): UseAthleteReturn {
    const { userId, isLoaded, isSignedIn } = useAuth();
    const [athlete, setAthlete] = useState<Athlete | null>(null);
    const [targetStrategy, setTargetStrategy] = useState<TargetStrategy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAthlete = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch athlete
            const { data: athleteData, error: athleteError } = await supabase
                .from('athletes')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (athleteError && athleteError.code !== 'PGRST116') {
                // PGRST116 = no rows returned (new user)
                throw athleteError;
            }

            if (athleteData) {
                setAthlete(athleteData);

                // Fetch target strategy
                const { data: strategyData, error: strategyError } = await supabase
                    .from('target_strategies')
                    .select('*')
                    .eq('athlete_id', athleteData.id)
                    .single();

                if (strategyError && strategyError.code !== 'PGRST116') {
                    console.error('Error fetching target strategy:', strategyError);
                }

                if (strategyData) {
                    setTargetStrategy(strategyData);
                }
            } else {
                setAthlete(null);
                setTargetStrategy(null);
            }
        } catch (err) {
            console.error('Error fetching athlete:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch athlete');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchAthlete();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
            setAthlete(null);
        }
    }, [isLoaded, isSignedIn, fetchAthlete]);

    const createAthlete = async (data: CreateAthleteData): Promise<Athlete | null> => {
        if (!userId) return null;

        try {
            setError(null);

            // Create athlete
            const { data: newAthlete, error: athleteError } = await supabase
                .from('athletes')
                .insert({
                    user_id: userId,
                    name: data.name,
                    grad_year: data.grad_year,
                    sport: data.sport,
                    onboarding_completed: data.onboarding_completed ?? false,
                })
                .select()
                .single();

            if (athleteError) throw athleteError;

            // Create target strategy if provided
            if (data.targetStrategy && newAthlete) {
                const { error: strategyError } = await supabase
                    .from('target_strategies')
                    .insert({
                        athlete_id: newAthlete.id,
                        levels: data.targetStrategy.levels,
                        regions: data.targetStrategy.regions,
                        in_state_only: data.targetStrategy.in_state_only,
                        target_count: data.targetStrategy.target_count,
                    });

                if (strategyError) {
                    console.error('Error creating target strategy:', strategyError);
                }
            }

            setAthlete(newAthlete);
            await fetchAthlete(); // Refresh to get complete data
            return newAthlete;
        } catch (err) {
            console.error('Error creating athlete:', err);
            setError(err instanceof Error ? err.message : 'Failed to create athlete');
            return null;
        }
    };

    const updateAthlete = async (data: Partial<Athlete>): Promise<boolean> => {
        if (!athlete) return false;

        try {
            setError(null);

            const { error: updateError } = await supabase
                .from('athletes')
                .update(data)
                .eq('id', athlete.id);

            if (updateError) throw updateError;

            await fetchAthlete();
            return true;
        } catch (err) {
            console.error('Error updating athlete:', err);
            setError(err instanceof Error ? err.message : 'Failed to update athlete');
            return false;
        }
    };

    return {
        athlete,
        targetStrategy,
        loading,
        error,
        refetch: fetchAthlete,
        createAthlete,
        updateAthlete,
    };
}

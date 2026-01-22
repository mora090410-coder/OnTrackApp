import { useState, useEffect, useCallback } from 'react';
import { supabase, createAuthenticatedClient } from '../lib/supabase';
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
    const { userId, isLoaded, isSignedIn, getToken } = useAuth();
    const [athlete, setAthlete] = useState<Athlete | null>(null);
    const [targetStrategy, setTargetStrategy] = useState<TargetStrategy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getClient = useCallback(async () => {
        const token = await getToken({ template: 'supabase' });
        return token ? createAuthenticatedClient(token) : supabase;
    }, [getToken]);

    const fetchAthlete = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const client = await getClient();

            // Fetch athlete
            const { data: athleteData, error: athleteError } = await client
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
                const { data: strategyData, error: strategyError } = await client
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
    }, [userId, getClient]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchAthlete();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
            setAthlete(null);
        }
    }, [isLoaded, isSignedIn, fetchAthlete]);

    const createAthlete = async (data: CreateAthleteData): Promise<Athlete | null> => {
        console.log('Creating athlete for user:', userId);
        if (!userId) return null;

        try {
            setError(null);
            const token = await getToken({ template: 'supabase' });
            console.log('Supabase Token retrieved:', !!token);

            const client = await getClient();

            // Create athlete
            console.log('Inserting athlete data...');
            const { data: newAthlete, error: athleteError } = await client
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

            if (athleteError) {
                console.error('Supabase Insert Error:', athleteError);
                throw athleteError;
            }

            console.log('Athlete created successfully:', newAthlete);

            // Create target strategy if provided
            if (data.targetStrategy && newAthlete) {
                console.log('Creating target strategy...');
                const { error: strategyError } = await client
                    .from('target_strategies')
                    .insert({
                        athlete_id: newAthlete.id,
                        levels: data.targetStrategy.levels,
                        regions: data.targetStrategy.regions,
                        in_state_only: data.targetStrategy.in_state_only,
                        target_count: data.targetStrategy.target_count,
                    });

                if (strategyError) console.error('Strategy Insert Error:', strategyError);
            }

            setAthlete(newAthlete);
            await fetchAthlete(); // Refresh to get complete data
            return newAthlete;
        } catch (err) {
            console.error('Error creating athlete (Full):', err);
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

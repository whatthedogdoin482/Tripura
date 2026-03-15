import { useState, useCallback } from 'react';
import type { Trip, TripDay, Activity, Restaurant } from '@/types';

export function useTrip(initialTrip?: Trip) {
  const [trip, setTrip] = useState<Trip | undefined>(initialTrip);
  const [isPlanning, setIsPlanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const createTrip = useCallback((destination: string, startDate: Date, endDate: Date) => {
    const days: TripDay[] = [];
    const currentDate = new Date(startDate);
    let dayNumber = 1;

    while (currentDate <= endDate) {
      days.push({
        id: `day-${dayNumber}`,
        date: new Date(currentDate),
        dayNumber,
        activities: [],
        restaurants: [],
        route: [],
        dailyBudget: 300,
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayNumber++;
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name: `${destination} Trip`,
      destination,
      startDate,
      endDate,
      days,
      budget: {
        total: days.length * 300,
        spent: 0,
        remaining: days.length * 300,
        currency: 'EUR',
        categories: [
          { id: '1', name: 'Unterkunft', allocated: days.length * 100, spent: 0, icon: 'Hotel', color: '#007AFF' },
          { id: '2', name: 'Essen', allocated: days.length * 80, spent: 0, icon: 'Utensils', color: '#34C759' },
          { id: '3', name: 'Aktivitäten', allocated: days.length * 60, spent: 0, icon: 'Ticket', color: '#FF9500' },
          { id: '4', name: 'Transport', allocated: days.length * 40, spent: 0, icon: 'Bus', color: '#AF52DE' },
          { id: '5', name: 'Shopping', allocated: days.length * 20, spent: 0, icon: 'ShoppingBag', color: '#FF2D55' },
        ],
      },
      status: 'planning',
    };

    setTrip(newTrip);
    setIsPlanning(true);
    return newTrip;
  }, []);

  const addActivityToDay = useCallback((dayId: string, activity: Activity) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day) =>
          day.id === dayId
            ? { ...day, activities: [...day.activities, activity] }
            : day
        ),
      };
    });
  }, []);

  const removeActivityFromDay = useCallback((dayId: string, activityId: string) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day) =>
          day.id === dayId
            ? { ...day, activities: day.activities.filter((a) => a.id !== activityId) }
            : day
        ),
      };
    });
  }, []);

  const addRestaurantToDay = useCallback((dayId: string, restaurant: Restaurant) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day) =>
          day.id === dayId
            ? { ...day, restaurants: [...day.restaurants, restaurant] }
            : day
        ),
      };
    });
  }, []);

  const updateBudget = useCallback((categoryId: string, amount: number) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        budget: {
          ...prev.budget,
          categories: prev.budget.categories.map((cat) =>
            cat.id === categoryId ? { ...cat, spent: cat.spent + amount } : cat
          ),
          spent: prev.budget.spent + amount,
          remaining: prev.budget.remaining - amount,
        },
      };
    });
  }, []);

  const updateBudgetAllocation = useCallback((categoryId: string, newAllocation: number) => {
    setTrip((prev) => {
      if (!prev) return prev;
      const updatedCategories = prev.budget.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, allocated: newAllocation } : cat
      );
      const newTotal = updatedCategories.reduce((sum, cat) => sum + cat.allocated, 0);
      return {
        ...prev,
        budget: {
          ...prev.budget,
          total: newTotal,
          remaining: newTotal - prev.budget.spent,
          categories: updatedCategories,
        },
      };
    });
  }, []);

  const optimizeRoute = useCallback((dayId: string) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day;
          const sorted = [...day.activities].sort((a, b) => {
            const distA = Math.sqrt(a.location.lat ** 2 + a.location.lng ** 2);
            const distB = Math.sqrt(b.location.lat ** 2 + b.location.lng ** 2);
            return distA - distB;
          });
          return { ...day, activities: sorted };
        }),
      };
    });
  }, []);

  const saveQuestionnaireAnswers = useCallback((dayId: string, answers: { questionId: string; answer: string }[]) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day) =>
          day.id === dayId
            ? {
                ...day,
                questionnaireAnswers: answers.map((a) => ({
                  ...a,
                  timestamp: new Date(),
                })),
              }
            : day
        ),
      };
    });
  }, []);

  return {
    trip,
    isPlanning,
    currentStep,
    setCurrentStep,
    createTrip,
    addActivityToDay,
    removeActivityFromDay,
    addRestaurantToDay,
    updateBudget,
    updateBudgetAllocation,
    optimizeRoute,
    saveQuestionnaireAnswers,
    setTrip,
  };
}

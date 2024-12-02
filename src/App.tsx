import React, { useState, useEffect } from 'react';
import { Trophy, Users, Table2, Settings, Award, TrendingUp, LogIn, LogOut, Trash2 } from 'lucide-react';
import {
  Button,
  Input,
  Alert,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './components/ui/base-components';

// Types
interface Team {
  name: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  gamesPlayed: number;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
  date?: string;
}

const TEAM_NAMES = [
  "שחר רוזנפלד",
  "תומר בקרינג",
  "ליאור הפטלר",
  "נועם ישראל",
  "אלון בקרינג",
  "בן טטנבאום",
  "עידן סולטן"
];

const ADMIN_PASSWORD = "1906";

const App = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'matches' | 'stats'>('table');
  const [notification, setNotification] = useState<string | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const matchOrder = [
      { home: "ליאור הפטלר", away: "נועם ישראל" },
      { home: "שחר רוזנפלד", away: "עידן סולטן" },
      { home: "תומר בקרינג", away: "בן טטנבאום" },
      { home: "אלון בקרינג", away: "ליאור הפטלר" },
      { home: "נועם ישראל", away: "שחר רוזנפלד" },
      { home: "בן טטנבאום", away: "עידן סולטן" },
      { home: "תומר בקרינג", away: "נועם ישראל" },
      { home: "אלון בקרינג", away: "שחר רוזנפלד" },
      { home: "ליאור הפטלר", away: "בן טטנבאום" },
      { home: "עידן סולטן", away: "נועם ישראל" },
      { home: "תומר בקרינג", away: "ליאור הפטלר" },
      { home: "אלון בקרינג", away: "עידן סולטן" },
      { home: "שחר רוזנפלד", away: "בן טטנבאום" },
      { home: "תומר בקרינג", away: "אלון בקרינג" },
      { home: "נועם ישראל", away: "בן טטנבאום" },
      { home: "ליאור הפטלר", away: "עידן סולטן" },
      { home: "שחר רוזנפלד", away: "תומר בקרינג" },
      { home: "אלון בקרינג", away: "נועם ישראל" },
      { home: "ליאור הפטלר", away: "שחר רוזנפלד" },
      { home: "עידן סולטן", away: "תומר בקרינג" },
      { home: "בן טטנבאום", away: "אלון בקרינג" }
    ];

    const initialMatches = matchOrder.map((match, index) => ({
      id: `match-${index}`,
      homeTeam: match.home,
      awayTeam: match.away,
      homeScore: null,
      awayScore: null,
      played: false
    }));

    setMatches(initialMatches);
  }, []);

  useEffect(() => {
    const newTeams = TEAM_NAMES.map(name => ({
      name,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      gamesPlayed: 0
    }));

    matches.forEach(match => {
      if (match.played && match.homeScore !== null && match.awayScore !== null) {
        const homeTeam = newTeams.find(t => t.name === match.homeTeam)!;
        const awayTeam = newTeams.find(t => t.name === match.awayTeam)!;

        homeTeam.gamesPlayed++;
        homeTeam.goalsFor += match.homeScore;
        homeTeam.goalsAgainst += match.awayScore;

        awayTeam.gamesPlayed++;
        awayTeam.goalsFor += match.awayScore;
        awayTeam.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
          homeTeam.points += 3;
        } else if (match.homeScore < match.awayScore) {
          awayTeam.points += 3;
        } else {
          homeTeam.points += 1;
          awayTeam.points += 1;
        }
      }
    });

    setTeams(newTeams.sort((a, b) => 
      b.points - a.points || 
      (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
    ));
  }, [matches]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginDialogOpen(false);
      setPassword("");
      setLoginError("");
      showNotification('התחברת בהצלחה כמנהל');
    } else {
      setLoginError("סיסמה שגויה");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    showNotification('התנתקת בהצלחה');
  };

  const updateMatch = async (match: Match, newHomeScore: number | null, newAwayScore: number | null, played: boolean) => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      const updatedMatch = {
        ...match,
        homeScore: newHomeScore,
        awayScore: newAwayScore,
        played,
        date: played ? new Date().toISOString() : undefined
      };

      setMatches(prevMatches => {
        const newMatches = prevMatches.map(m => 
          m.id === match.id ? updatedMatch : m
        );
        return newMatches.sort((a, b) => {
          if (a.played && !b.played) return -1;
          if (!a.played && b.played) return 1;
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
        });
      });

      setSelectedMatch(null);
      setHomeScore("");
      setAwayScore("");
      showNotification(played ? 'התוצאה נשמרה בהצלחה!' : 'התוצאה נמחקה בהצלחה!');
    } catch (error) {
      console.error('Error updating match:', error);
      showNotification('אירעה שגיאה בעדכון התוצאה');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (match: Match) => {
    if (isAdmin) {
      setSelectedMatch(match);
      if (match.played && match.homeScore !== null && match.awayScore !== null) {
        setHomeScore(match.homeScore.toString());
        setAwayScore(match.awayScore.toString());
      } else {
        setHomeScore("");
        setAwayScore("");
      }
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Components
  const TabButton = ({ tab, current, icon: Icon, label }: { tab: string, current: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        tab === current ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
      }`}
      aria-selected={tab === current}
      role="tab"
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const LeagueTable = () => (
    <div className="overflow-x-auto bg-white rounded-lg shadow" role="region" aria-label="טבלת ליגה">
      <table className="w-full text-right">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">דירוג</th>
            <th scope="col" className="px-6 py-3">שחקן</th>
            <th scope="col" className="px-6 py-3">נקודות</th>
            <th scope="col" className="px-6 py-3">משחקים</th>
            <th scope="col" className="px-6 py-3">יחס שערים</th>
            <th scope="col" className="px-6 py-3">הפרש</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr 
              key={team.name} 
              className={`${index % 2 === 0 ? 'bg-gray-50' : ''} ${
                index < 3 ? 'font-bold' : ''
              }`}
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{team.name}</td>
              <td className="px-6 py-4">{team.points}</td>
              <td className="px-6 py-4">{team.gamesPlayed}</td>
              <td className="px-6 py-4">{team.goalsFor}:{team.goalsAgainst}</td>
              <td className="px-6 py-4">{team.goalsFor - team.goalsAgainst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const MatchList = () => (
    <div className="space-y-4">
      {matches.map(match => (
        <div
          key={match.id}
          onClick={() => handleMatchClick(match)}
          className={`p-4 bg-white rounded-lg shadow transition ${
            isAdmin ? 'cursor-pointer hover:bg-blue-50' : ''
          } ${match.played ? 'border-l-4 border-green-500' : ''}`}
          role="button"
          tabIndex={isAdmin ? 0 : undefined}
          aria-label={`משחק בין ${match.homeTeam} ל${match.awayTeam}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 text-right font-medium">{match.homeTeam}</div>
            <div className="px-4 font-bold">
              {match.played 
                ? `${match.homeScore}:${match.awayScore}`
                : 'טרם שוחק'}
            </div>
            <div className="flex-1 text-left font-medium">{match.awayTeam}</div>
          </div>
          {match.played && match.date && (
            <div className="text-sm text-gray-500 text-center mt-2">
              {new Date(match.date).toLocaleDateString('he-IL')}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const Stats = () => {
    const topScorer = [...teams].sort((a, b) => b.goalsFor - a.goalsFor)[0];
    const bestDefense = [...teams].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
    const mostGames = [...teams].sort((a, b) => b.gamesPlayed - a.gamesPlayed)[0];
    const bestRatio = [...teams].sort((a, b) => 
      (b.goalsFor / (b.gamesPlayed || 1)) - (a.goalsFor / (a.gamesPlayed || 1))
    )[0];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-yellow-500" />
            <h3 className="font-bold">מלך השערים</h3>
          </div>
          {topScorer && (
            <>
              <p className="text-lg font-medium">{topScorer.name}</p>
              <p className="text-3xl font-bold text-yellow-500">{topScorer.goalsFor} שערים</p>
              <p className="text-sm text-gray-500">ב-{topScorer.gamesPlayed} משחקים</p>
            </>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-500" />
            <h3 className="font-bold">ההגנה הטובה ביותר</h3>
          </div>
          {bestDefense && (
            <>
              <p className="text-lg font-medium">{bestDefense.name}</p>
              <p className="text-3xl font-bold text-green-500">{bestDefense.goalsAgainst} שערים</p>
              <p className="text-sm text-gray-500">ספג ב-{bestDefense.gamesPlayed} משחקים</p>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-2 mb-4">
            <Table2 className="text-blue-500" />
            <h3 className="font-bold">הכי הרבה משחקים</h3>
          </div>
          {mostGames && (
            <>
              <p className="text-lg font-medium">{mostGames.name}</p>
              <p className="text-3xl font-bold text-blue-500">{mostGames.gamesPlayed} משחקים</p>
              <p className="text-sm text-gray-500">{mostGames.points} נקודות</p>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-purple-500" />
            <h3 className="font-bold">היעיל ביותר</h3>
          </div>
          {bestRatio && (
            <>
              <p className="text-lg font-medium">{bestRatio.name}</p>
              <p className="text-3xl font-bold text-purple-500">
                {(bestRatio.goalsFor / (bestRatio.gamesPlayed || 1)).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">שערים למשחק</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4" dir="rtl">
        <header className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">ליגת החברים</h1>
            <div className="flex gap-4">
              <TabButton tab="table" current={activeTab} icon={Trophy} label="טבלה" />
              <TabButton tab="matches" current={activeTab} icon={Users} label="משחקים" />
              <TabButton tab="stats" current={activeTab} icon={Settings} label="סטטיסטיקות" />
            </div>
            <button
              onClick={() => isAdmin ? handleLogout() : setLoginDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              aria-label={isAdmin ? "התנתק" : "התחבר כמנהל"}
            >
              {isAdmin ? <LogOut size={20} /> : <LogIn size={20} />}
              <span>{isAdmin ? "התנתק" : "התחבר כמנהל"}</span>
            </button>
          </div>
        </header>

        {notification && (
          <Alert className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-slide-down">
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        )}

        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>התחברות מנהל</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="text-right"
              />
              {loginError && (
                <p className="text-red-500 text-sm text-right">{loginError}</p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleLogin} className="w-full">התחבר</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedMatch?.played ? 'עריכת תוצאת משחק' : 'הזנת תוצאת משחק'}
              </DialogTitle>
            </DialogHeader>
            {selectedMatch && (
              <div className="space-y-6">
                <div className="grid grid-cols-7 items-center gap-4">
                  <div className="col-span-3 text-right font-medium">
                    {selectedMatch.homeTeam}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    className="col-span-1 text-center"
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    className="col-span-1 text-center"
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                  />
                  <div className="col-span-2 text-right font-medium">
                    {selectedMatch.awayTeam}
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  {selectedMatch.played && (
                    <Button
                      variant="secondary"
                      onClick={() => updateMatch(selectedMatch, null, null, false)}
                      disabled={loading}
                      className="gap-2 bg-red-100 text-red-600 hover:bg-red-200 border-red-200"
                    >
                      <Trash2 size={16} />
                      מחק תוצאה
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (homeScore && awayScore) {
                        updateMatch(
                          selectedMatch,
                          parseInt(homeScore),
                          parseInt(awayScore),
                          true
                        );
                      }
                    }}
                    disabled={!homeScore || !awayScore || loading}
                    className="gap-2"
                  >
                    {loading ? 'מעדכן...' : 'שמור תוצאה'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <main className="space-y-6">
          {activeTab === 'table' && <LeagueTable />}
          {activeTab === 'matches' && <MatchList />}
          {activeTab === 'stats' && <Stats />}
        </main>
      </div>
    </div>
  );
};

export default App;
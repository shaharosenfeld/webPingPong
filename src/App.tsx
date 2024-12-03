import React, { useState, useEffect } from 'react';
import { Trophy, Users, Table2, Settings, Award, TrendingUp, LogIn, LogOut, Trash2, Calendar, Activity, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const TEAM_NAMES = [
  "שחר רוזנפלד",
  "תומר בקרינג",
  "ליאור הפטלר",
  "נועם ישראל",
  "אלון בקרינג",
  "בן טטנבאום",
  "עידן סולטן"
];

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
  round?: number;
}

export default function EnhancedApp() {
  const [activeTab, setActiveTab] = useState('table');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  
  // Initialize matches
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
      played: false,
      round: Math.floor(index / 3) + 1
    }));

    setMatches(initialMatches);
  }, []);

  // Initialize teams and calculate stats
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

  // Sample performance data
  const performanceData = teams.map(team => ({
    name: team.name,
    points: team.points,
    goals: team.goalsFor
  }));

  const handleMatchClick = (match: Match) => {
    if (!isAdmin) return;
    setSelectedMatch(match);
    if (match.played && match.homeScore !== null && match.awayScore !== null) {
      setHomeScore(match.homeScore.toString());
      setAwayScore(match.awayScore.toString());
    } else {
      setHomeScore("");
      setAwayScore("");
    }
  };

  const handleMatchUpdate = () => {
    if (!selectedMatch || !homeScore || !awayScore) return;

    const updatedMatch = {
      ...selectedMatch,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
      played: true,
      date: new Date().toISOString()
    };

    setMatches(matches.map(m => m.id === selectedMatch.id ? updatedMatch : m));
    setSelectedMatch(null);
  };

  const handleMatchDelete = () => {
    if (!selectedMatch) return;

    const updatedMatch = {
      ...selectedMatch,
      homeScore: null,
      awayScore: null,
      played: false,
      date: undefined
    };

    setMatches(matches.map(m => m.id === selectedMatch.id ? updatedMatch : m));
    setSelectedMatch(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4" dir="rtl">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-3xl font-bold text-blue-600">
                טורניר השמואלים השני
              </h1>
              <p className="text-gray-600 mt-2">2024 עונת</p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'table', icon: Trophy, label: 'טבלה' },
                { id: 'matches', icon: Users, label: 'משחקים' },
                { id: 'stats', icon: BarChart2, label: 'סטטיסטיקות' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md transition
                    ${activeTab === id 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'hover:bg-white/50 text-gray-600'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Admin Button */}
            <button
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition
                ${isAdmin 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
              onClick={() => isAdmin ? setIsAdmin(false) : setLoginDialogOpen(true)}
            >
              {isAdmin ? <LogOut size={18} /> : <LogIn size={18} />}
              <span>{isAdmin ? "התנתק" : "התחבר"}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Table View */}
          {activeTab === 'table' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">טבלת הליגה</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-right">דירוג</th>
                      <th className="p-4 text-right">שחקן</th>
                      <th className="p-4 text-center">נק'</th>
                      <th className="p-4 text-center">מש'</th>
                      <th className="p-4 text-center">הבקעות</th>
                      <th className="p-4 text-center">ספיגות</th>
                      <th className="p-4 text-center">הפרש</th>
                      <th className="p-4 text-center">ניצחון%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr 
                        key={team.name}
                        className={`
                          border-b transition hover:bg-gray-50
                          ${index < 3 ? 'font-bold' : ''}
                          ${index === 0 ? 'bg-yellow-50' : ''}
                        `}
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{team.name}</td>
                        <td className="p-4 text-center">{team.points}</td>
                        <td className="p-4 text-center">{team.gamesPlayed}</td>
                        <td className="p-4 text-center text-green-600">{team.goalsFor}</td>
                        <td className="p-4 text-center text-red-600">{team.goalsAgainst}</td>
                        <td className="p-4 text-center">{team.goalsFor - team.goalsAgainst}</td>
                        <td className="p-4 text-center">
                          {team.gamesPlayed ? ((team.points / (team.gamesPlayed * 3)) * 100).toFixed(1) : "0"}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Matches View */}
          {activeTab === 'matches' && (
            <div className="grid gap-6">
              {matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => handleMatchClick(match)}
                  className={`
                    bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl
                    ${match.played ? 'border-l-4 border-green-500' : ''}
                    ${isAdmin ? 'cursor-pointer' : ''}
                  `}
                >
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{match.homeTeam}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {match.played 
                          ? `${match.homeScore} : ${match.awayScore}`
                          : 'טרם שוחק'
                        }
                      </div>
                      {match.date && (
                        <div className="text-sm text-gray-500 mt-2">
                          {new Date(match.date).toLocaleDateString('he-IL')}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        סיבוב {match.round}
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">{match.awayTeam}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats View */}
          {activeTab === 'stats' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { 
                    title: "מלך השערים",
                    icon: <Trophy className="text-yellow-500" />,
                    data: teams[0],
                    value: teams[0]?.goalsFor || 0,
                    subtitle: "שערים"
                  },
                  {
                    title: "ההגנה הטובה",
                    icon: <Activity className="text-green-500" />,
                    data: [...teams].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0],
                    value: teams[0]?.goalsAgainst || 0,
                    subtitle: "ספיגות"
                  },
                  {
                    title: "היעיל ביותר",
                    icon: <TrendingUp className="text-blue-500" />,
                    data: [...teams].sort((a, b) => 
                      (b.goalsFor / (b.gamesPlayed || 1)) - (a.goalsFor / (a.gamesPlayed || 1))
                    )[0],
                    value: teams[0] ? (teams[0].goalsFor / (teams[0].gamesPlayed || 1)).toFixed(2) : "0",
                    subtitle: "שערים למשחק"
                  },
                  {
                    title: "מלך הנקודות",
                    icon: <Award className="text-purple-500" />,
                    data: teams[0],
                    value: teams[0]?.points || 0,
                    subtitle: "נקודות"
                  }
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {stat.icon}
                      <h3 className="font-semibold">{stat.title}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">{stat.data?.name || "אין נתונים"}</p>
                      <p className="text-3xl font-bold">{stat.value}</p><p className="text-sm text-gray-500">{stat.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">מגמת נקודות</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="points" stroke="#3b82f6" name="נקודות" />
                      <Line type="monotone" dataKey="goals" stroke="#10b981" name="שערים" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Login Dialog */}
      {loginDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">התחברות מנהל</h2>
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && password === "1906" && setIsAdmin(true)}
              className="w-full p-2 border rounded-lg mb-4 text-right"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setLoginDialogOpen(false)}
              >
                ביטול
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => {
                  if (password === "1906") {
                    setIsAdmin(true);
                    setLoginDialogOpen(false);
                    setPassword("");
                  }
                }}
              >
                התחבר
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Update Dialog */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {selectedMatch.played ? 'עריכת תוצאה' : 'הזנת תוצאה'}
            </h2>
            <div className="grid grid-cols-7 gap-4 items-center mb-6">
              <div className="col-span-3 text-right">{selectedMatch.homeTeam}</div>
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="col-span-1 p-2 border rounded-lg text-center"
              />
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="col-span-1 p-2 border rounded-lg text-center"
              />
              <div className="col-span-2 text-right">{selectedMatch.awayTeam}</div>
            </div>
            <div className="flex justify-between">
              {selectedMatch.played && (
                <button
                  onClick={handleMatchDelete}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <Trash2 size={16} className="inline-block mr-2" />
                  מחק תוצאה
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  ביטול
                </button>
                <button
                  onClick={handleMatchUpdate}
                  disabled={!homeScore || !awayScore}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  שמור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
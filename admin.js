document.addEventListener('DOMContentLoaded', () => {
    // ----- State -----
    let electionStatus = 'Not Started'; // 'Not Started' | 'Running' | 'Ended'

    // ----- Elements -----
    const startBtn = document.getElementById('startVotingBtn');
    const endBtn = document.getElementById('endVotingBtn');
    const statusDot = document.getElementById('electionStatusDot');
    const statusLabel = document.getElementById('electionStatusLabel');
    const statusStatText = document.getElementById('electionStatusStatText');
    const totalCandidatesCount = document.getElementById('totalCandidatesCount');
    const addCandidateBtn = document.getElementById('addCandidateBtn');
    const candidateList = document.getElementById('candidateList');

    // ----- UI helpers -----
    function updateElectionUI() {
        statusLabel.textContent = electionStatus;
        statusStatText.textContent = electionStatus;

        if (electionStatus === 'Not Started') {
            statusDot.className = 'w-2 h-2 bg-slate-400 rounded-full';
            startBtn.disabled = false;
            endBtn.disabled = true;
        } else if (electionStatus === 'Running') {
            statusDot.className = 'w-2 h-2 bg-emerald-500 rounded-full';
            startBtn.disabled = true;
            endBtn.disabled = false;
        } else if (electionStatus === 'Ended') {
            statusDot.className = 'w-2 h-2 bg-red-500 rounded-full';
            startBtn.disabled = true;
            endBtn.disabled = true;
        }

        startBtn.classList.toggle('opacity-50', startBtn.disabled);
        startBtn.classList.toggle('cursor-not-allowed', startBtn.disabled);
        endBtn.classList.toggle('opacity-50', endBtn.disabled);
        endBtn.classList.toggle('cursor-not-allowed', endBtn.disabled);
    }

    function updateTotalCandidates() {
        totalCandidatesCount.textContent = candidateList.querySelectorAll('.candidate-card').length;
    }

    function createCandidateCard({ name, position, party }) {
        const card = document.createElement('div');
        card.className = 'candidate-card flex items-center justify-between p-4 lg:p-6 rounded-3xl border border-slate-50 bg-white hover:border-slate-200 transition';
        card.innerHTML = `
            <div class="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?u=${encodeURIComponent(name)}" class="w-12 h-12 rounded-2xl object-cover">
                <div>
                    <h4 class="font-bold text-sm">${name}</h4>
                    <p class="text-xs font-bold text-blue-600">${position}</p>
                    <p class="text-[0.65rem] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span> ${party}
                    </p>
                </div>
            </div>
            <button class="remove-candidate-btn p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>`;
        return card;
    }

    // ----- Event Listeners -----

    startBtn.addEventListener('click', () => {
        if (electionStatus !== 'Not Started') return;
        electionStatus = 'Running';
        updateElectionUI();
        alert('Election is Live');
    });

    endBtn.addEventListener('click', () => {
        if (electionStatus !== 'Running') return;
        electionStatus = 'Ended';
        updateElectionUI();
        alert('Election has Ended');
    });

    addCandidateBtn.addEventListener('click', () => {
        const name = prompt('Candidate Name:');
        if (!name) return; // cancelled

        const position = prompt('Position:', 'For President') || 'For President';
        const party = prompt('Party / Alliance:', '') || 'Independent';

        candidateList.appendChild(createCandidateCard({ name, position, party }));
        lucide.createIcons(); // render the new trash icon
        updateTotalCandidates();
    });

    // Event delegation: handles original cards AND any added later
    candidateList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-candidate-btn');
        if (!removeBtn) return;

        const card = removeBtn.closest('.candidate-card');
        const name = card.querySelector('h4')?.textContent || 'this candidate';

        if (confirm(`Remove ${name} from the ballot?`)) {
            card.remove();
            updateTotalCandidates();
        }
    });

    // ----- Init -----
    updateElectionUI();
    updateTotalCandidates();
});
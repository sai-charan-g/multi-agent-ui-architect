// Tab Switching Logic
const tabGenerate = document.getElementById('tab-generate');
const tabManage = document.getElementById('tab-manage');
const viewGenerate = document.getElementById('view-generate');
const viewManage = document.getElementById('view-manage');

function switchTab(tab) {
    if (tab === 'generate') {
        tabGenerate.classList.replace('text-zinc-400', 'text-black');
        tabGenerate.classList.replace('hover:text-white', 'bg-white');
        tabGenerate.classList.add('bg-white');
        tabManage.classList.replace('text-black', 'text-zinc-400');
        tabManage.classList.replace('bg-white', 'hover:text-white');
        tabManage.classList.remove('bg-white');
        
        viewGenerate.classList.remove('hidden');
        viewManage.classList.add('hidden');
    } else {
        tabManage.classList.replace('text-zinc-400', 'text-black');
        tabManage.classList.replace('hover:text-white', 'bg-white');
        tabManage.classList.add('bg-white');
        tabGenerate.classList.replace('text-black', 'text-zinc-400');
        tabGenerate.classList.replace('bg-white', 'hover:text-white');
        tabGenerate.classList.remove('bg-white');
        
        viewManage.classList.remove('hidden');
        viewGenerate.classList.add('hidden');
        loadProjects();
    }
}

tabGenerate.addEventListener('click', () => switchTab('generate'));
tabManage.addEventListener('click', () => switchTab('manage'));

// Generate Form Logic (Existing)
document.getElementById('generate-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const promptInput = document.getElementById('prompt');
    const submitBtn = document.getElementById('submit-btn');
    const terminalContainer = document.getElementById('terminal-container');
    const terminalOutput = document.getElementById('terminal-output');
    const resultContainer = document.getElementById('result-container');
    const resultPath = document.getElementById('result-path');

    const prompt = promptInput.value.trim();
    if (!prompt) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...`;
    terminalOutput.innerHTML = '';
    terminalContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, loops: 3 })
        });

        const data = await response.json();
        
        if (data.error) {
            appendLog(terminalOutput, 'error', `Error: ${data.error}`);
            resetBtn(submitBtn, 'Generate Website');
            return;
        }

        connectSSE(data.jobId, terminalOutput, (result) => {
            resetBtn(submitBtn, 'Generate Website');
            
            // Extract project name from outputDir
            let generatedProjectName = 'Generated';
            if (result && result.outputDir) {
                const parts = result.outputDir.split(/[\\/]/);
                generatedProjectName = parts[parts.length - 1];
            }
            
            showResult(resultContainer, resultPath, result?.outputDir || 'Generated');
            
            const downloadBtn = document.getElementById('download-generated-btn');
            downloadBtn.classList.remove('hidden');
            downloadBtn.onclick = () => {
                window.location.href = `/api/projects/${generatedProjectName}/download`;
            };
            
        }, () => resetBtn(submitBtn, 'Generate Website'));

    } catch (err) {
        appendLog(terminalOutput, 'error', `Request failed: ${err.message}`);
        resetBtn(submitBtn, 'Generate Website');
    }
});

// Manage Projects Logic
let currentProject = null;
let currentFile = null;

const projectsList = document.getElementById('projects-list');
const fileList = document.getElementById('file-list');
const codeEditor = document.getElementById('code-editor');
const currentProjectName = document.getElementById('current-project-name');
const currentFileName = document.getElementById('current-file-name');
const saveFileBtn = document.getElementById('save-file-btn');
const agentEditPrompt = document.getElementById('agent-edit-prompt');
const agentEditBtn = document.getElementById('agent-edit-btn');
const emptyWorkspace = document.getElementById('empty-workspace');
const projectWorkspace = document.getElementById('project-workspace');

const viewCodeBtn = document.getElementById('view-code-btn');
const viewPreviewBtn = document.getElementById('view-preview-btn');
const codeContainer = document.getElementById('code-container');
const previewContainer = document.getElementById('preview-container');
const previewOverlay = document.getElementById('preview-overlay');
const previewStatusText = document.getElementById('preview-status-text');
const startPreviewBtn = document.getElementById('start-preview-btn');
const startPreviewText = document.getElementById('start-preview-text');
const previewIframe = document.getElementById('preview-iframe');
const stopPreviewBtn = document.getElementById('stop-preview-btn');
const openPreviewExternalBtn = document.getElementById('open-preview-external-btn');

// View Toggle
function switchWorkspaceView(view) {
    if (view === 'code') {
        viewCodeBtn.classList.replace('text-zinc-400', 'text-black');
        viewCodeBtn.classList.replace('hover:text-white', 'bg-white');
        viewCodeBtn.classList.add('bg-white');
        viewPreviewBtn.classList.replace('text-black', 'text-zinc-400');
        viewPreviewBtn.classList.replace('bg-white', 'hover:text-white');
        viewPreviewBtn.classList.remove('bg-white');
        
        codeContainer.classList.remove('hidden');
        previewContainer.classList.add('hidden');
    } else {
        viewPreviewBtn.classList.replace('text-zinc-400', 'text-black');
        viewPreviewBtn.classList.replace('hover:text-white', 'bg-white');
        viewPreviewBtn.classList.add('bg-white');
        viewCodeBtn.classList.replace('text-black', 'text-zinc-400');
        viewCodeBtn.classList.replace('bg-white', 'hover:text-white');
        viewCodeBtn.classList.remove('bg-white');
        
        previewContainer.classList.remove('hidden');
        codeContainer.classList.add('hidden');
        checkPreviewStatus();
    }
}
viewCodeBtn.addEventListener('click', () => switchWorkspaceView('code'));
viewPreviewBtn.addEventListener('click', () => switchWorkspaceView('preview'));

async function loadProjects() {
    projectsList.innerHTML = '<div class="text-zinc-500 p-2 text-sm">Loading...</div>';
    try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        
        projectsList.innerHTML = '';
        if (data.projects.length === 0) {
            projectsList.innerHTML = '<div class="text-zinc-500 p-2 text-sm">No projects found.</div>';
            return;
        }

        data.projects.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left px-3 py-2 rounded-md text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors truncate';
            btn.innerText = p;
            btn.onclick = () => selectProject(p);
            if (currentProject === p) btn.classList.add('bg-zinc-800', 'text-white');
            projectsList.appendChild(btn);
        });
    } catch (err) {
        projectsList.innerHTML = '<div class="text-red-500 p-2 text-sm">Failed to load projects.</div>';
    }
}

document.getElementById('refresh-projects-btn').onclick = loadProjects;

async function selectProject(projectName) {
    currentProject = projectName;
    currentProjectName.innerText = projectName;
    emptyWorkspace.classList.add('hidden');
    projectWorkspace.classList.remove('hidden');
    
    // Enable agent inputs
    agentEditPrompt.disabled = false;
    agentEditBtn.disabled = false;
    const uploadImageBtn = document.getElementById('upload-image-btn');
    if (uploadImageBtn) uploadImageBtn.disabled = false;

    // Highlight active in sidebar
    Array.from(projectsList.children).forEach(btn => {
        if (btn.innerText === projectName) {
            btn.classList.add('bg-zinc-800', 'text-white');
        } else {
            btn.classList.remove('bg-zinc-800', 'text-white');
        }
    });

    // Reset view to code
    switchWorkspaceView('code');

    // Reset editor
    codeEditor.value = '';
    codeEditor.disabled = true;
    currentFileName.innerText = 'Select a file';
    saveFileBtn.classList.add('hidden');
    currentFile = null;

    // Load files
    fileList.innerHTML = '<div class="text-zinc-500 text-xs p-2">Loading...</div>';
    try {
        const res = await fetch(`/api/projects/${projectName}/files`);
        const data = await res.json();
        
        fileList.innerHTML = '';
        data.files.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left px-2 py-1 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors truncate';
            // simple indentation simulation
            const parts = f.split('/');
            const padding = (parts.length - 1) * 8;
            btn.style.paddingLeft = `${padding + 8}px`;
            
            // Icon
            const icon = `<svg class="w-3.5 h-3.5 inline mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`;
            
            btn.innerHTML = `${icon} ${parts[parts.length - 1]}`;
            btn.title = f;
            btn.onclick = () => selectFile(projectName, f, btn);
            fileList.appendChild(btn);
        });
    } catch (err) {
        fileList.innerHTML = '<div class="text-red-500 text-xs p-2">Failed to load files.</div>';
    }
}

async function selectFile(projectName, path, btnElement) {
    currentFile = path;
    currentFileName.innerText = path;
    
    // Highlight
    if (btnElement) {
        Array.from(fileList.children).forEach(b => b.classList.remove('bg-zinc-800', 'text-white'));
        btnElement.classList.add('bg-zinc-800', 'text-white');
    }

    codeEditor.value = 'Loading...';
    codeEditor.disabled = true;
    saveFileBtn.classList.add('hidden');

    try {
        const res = await fetch(`/api/projects/${projectName}/file?path=${encodeURIComponent(path)}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        codeEditor.value = data.content;
        codeEditor.disabled = false;
        saveFileBtn.classList.remove('hidden');
    } catch (err) {
        codeEditor.value = `Error loading file: ${err.message}`;
    }
}

saveFileBtn.onclick = async () => {
    if (!currentProject || !currentFile) return;
    
    saveFileBtn.innerText = 'Saving...';
    saveFileBtn.disabled = true;
    
    try {
        const res = await fetch(`/api/projects/${currentProject}/file`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: currentFile, content: codeEditor.value })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        saveFileBtn.innerText = 'Saved!';
        setTimeout(() => {
            saveFileBtn.innerText = 'Save';
            saveFileBtn.disabled = false;
        }, 2000);
    } catch (err) {
        alert('Failed to save file: ' + err.message);
        saveFileBtn.innerText = 'Save';
        saveFileBtn.disabled = false;
    }
};

document.getElementById('delete-project-btn').onclick = async () => {
    if (!currentProject) return;
    if (!confirm(`Are you sure you want to delete ${currentProject}?`)) return;
    
    try {
        await fetch(`/api/projects/${currentProject}`, { method: 'DELETE' });
        currentProject = null;
        emptyWorkspace.classList.remove('hidden');
        projectWorkspace.classList.add('hidden');
        loadProjects();
    } catch (err) {
        alert('Failed to delete project.');
    }
};

document.getElementById('download-project-btn').onclick = () => {
    if (!currentProject) return;
    window.location.href = `/api/projects/${currentProject}/download`;
};

// Agent Edit Logic
const agentEditForm = document.getElementById('agent-edit-form');
const editTerminalModal = document.getElementById('edit-terminal-modal');
const editTerminalOutput = document.getElementById('edit-terminal-output');
const closeEditTerminalBtn = document.getElementById('close-edit-terminal');
const agentEditBtnText = document.getElementById('agent-edit-btn-text');

const agentImageInput = document.getElementById('agent-image-input');
const uploadImageBtn = document.getElementById('upload-image-btn');
const agentImagePreviewContainer = document.getElementById('agent-image-preview-container');

let currentAgentImages = [];

function renderImagePreviews() {
    if (currentAgentImages.length === 0) {
        agentImagePreviewContainer.classList.add('hidden');
        agentImagePreviewContainer.classList.remove('flex');
        agentImagePreviewContainer.innerHTML = '';
        return;
    }

    agentImagePreviewContainer.classList.remove('hidden');
    agentImagePreviewContainer.classList.add('flex');
    agentImagePreviewContainer.innerHTML = '';

    currentAgentImages.forEach((img, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative inline-block';
        
        const imgEl = document.createElement('img');
        imgEl.src = img.data;
        imgEl.className = 'h-16 w-16 object-cover rounded border border-zinc-700 shadow';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-md border border-zinc-700 z-10';
        removeBtn.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        
        removeBtn.onclick = (e) => {
            e.preventDefault();
            currentAgentImages.splice(index, 1);
            renderImagePreviews();
        };

        wrapper.appendChild(imgEl);
        wrapper.appendChild(removeBtn);
        agentImagePreviewContainer.appendChild(wrapper);
    });
}

if (uploadImageBtn) {
    uploadImageBtn.onclick = () => {
        agentImageInput.click();
    };
}

if (agentImageInput) {
    agentImageInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentAgentImages.push({
                    data: event.target.result,
                    mimeType: file.type,
                    name: file.name
                });
                renderImagePreviews();
            };
            reader.readAsDataURL(file);
        });
        
        // Reset input so the same files can be selected again
        agentImageInput.value = '';
    };
}

window.addEventListener('paste', (e) => {
    if (!currentProject || viewManage.classList.contains('hidden')) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (!file) continue;

            const ext = file.type.split('/')[1] || 'png';
            const fileName = `pasted-image-${Math.random().toString(36).substring(7)}.${ext}`;

            const reader = new FileReader();
            reader.onload = (event) => {
                currentAgentImages.push({
                    data: event.target.result,
                    mimeType: file.type,
                    name: fileName
                });
                renderImagePreviews();
            };
            reader.readAsDataURL(file);
            
            if (e.target === agentEditPrompt) e.preventDefault();
            break;
        }
    }
});

if (agentEditPrompt) {
    agentEditPrompt.addEventListener('keydown', (e) => {
        // Submit on Enter (if not holding Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!agentEditBtn.disabled) {
                agentEditForm.dispatchEvent(new Event('submit'));
            }
        }
    });
}

agentEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentProject) return;
    
    const prompt = agentEditPrompt.value.trim();
    if (!prompt) return;

    agentEditPrompt.disabled = true;
    agentEditBtn.disabled = true;
    if (uploadImageBtn) uploadImageBtn.disabled = true;
    if (agentEditBtnText) agentEditBtnText.innerText = 'Working...';
    else agentEditBtn.innerText = 'Working...';
    
    editTerminalOutput.innerHTML = '';
    editTerminalModal.classList.remove('hidden');
    closeEditTerminalBtn.classList.add('hidden');

    try {
        const response = await fetch(`/api/projects/${currentProject}/agent-edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, images: currentAgentImages })
        });

        const data = await response.json();
        
        if (data.error) {
            appendLog(editTerminalOutput, 'error', `Error: ${data.error}`);
            finishEditAgent();
            return;
        }

        connectSSE(data.jobId, editTerminalOutput, () => {
            finishEditAgent();
            // Reload file if it was open
            if (currentFile) selectFile(currentProject, currentFile);
            closeEditTerminalBtn.classList.remove('hidden');
        }, () => {
            finishEditAgent();
            closeEditTerminalBtn.classList.remove('hidden');
        });

    } catch (err) {
        appendLog(editTerminalOutput, 'error', `Request failed: ${err.message}`);
        finishEditAgent();
        closeEditTerminalBtn.classList.remove('hidden');
    }
});

closeEditTerminalBtn.onclick = () => {
    editTerminalModal.classList.add('hidden');
};

function finishEditAgent() {
    agentEditPrompt.disabled = false;
    agentEditBtn.disabled = false;
    if (uploadImageBtn) uploadImageBtn.disabled = false;
    if (agentEditBtnText) agentEditBtnText.innerText = 'Apply Edit';
    else agentEditBtn.innerText = 'Apply Edit';
    agentEditPrompt.value = '';
    
    // Clear image
    currentAgentImages = [];
    if (agentImageInput) agentImageInput.value = '';
    renderImagePreviews();
}

// Helpers
function connectSSE(jobId, terminalOutputEl, onDone, onError) {
    const eventSource = new EventSource(`/api/events/${jobId}`);

    eventSource.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        
        if (parsed.type === 'connected') {
            appendLog(terminalOutputEl, 'info', 'Connected to Agent Pipeline...');
        } else if (parsed.type === 'log' || parsed.type === 'done' || parsed.type === 'error') {
            appendLog(terminalOutputEl, parsed.level, parsed.message);
            if (parsed.type === 'done') {
                eventSource.close();
                if (onDone) onDone(parsed.result);
            } else if (parsed.type === 'error') {
                eventSource.close();
                if (onError) onError();
            }
        }
    };

    eventSource.onerror = () => {
        appendLog(terminalOutputEl, 'error', 'Connection to server lost.');
        eventSource.close();
        if (onError) onError();
    };
}

function appendLog(container, level, message) {
    const div = document.createElement('div');
    
    const colors = {
        'info': 'text-blue-400',
        'success': 'text-green-400',
        'warn': 'text-yellow-400',
        'error': 'text-red-400',
        'debug': 'text-zinc-500',
        'agent': 'text-purple-400'
    };

    const icons = {
        'info': 'ℹ',
        'success': '✓',
        'warn': '⚠',
        'error': '✗',
        'debug': '·',
        'agent': '🤖'
    };

    const colorClass = colors[level] || 'text-white';
    const icon = icons[level] || '>';
    const time = new Date().toLocaleTimeString();

    div.innerHTML = `<span class="text-zinc-600">[${time}]</span> <span class="${colorClass}">${icon} ${level.toUpperCase().padEnd(7)}</span> ${message}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function resetBtn(btn, text) {
    btn.disabled = false;
    btn.innerHTML = `
        <span>${text}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    `;
}

function showResult(container, pathEl, path) {
    pathEl.innerText = path;
    container.classList.remove('hidden');
}

// Preview Logic (In-Browser Sandbox powered directly by MongoDB Atlas)
function loadBrowserSandbox(projectName) {
    if (!projectName) return;
    previewOverlay.classList.add('hidden');
    const url = `/preview-sandbox.html?project=${encodeURIComponent(projectName)}`;
    previewIframe.src = url;
    previewIframe.classList.remove('hidden');
    stopPreviewBtn.classList.remove('hidden');
    if (openPreviewExternalBtn) {
        openPreviewExternalBtn.href = url;
        openPreviewExternalBtn.classList.remove('hidden');
    }
}

function checkPreviewStatus() {
    if (!currentProject) return;
    // Auto-load in-browser preview from MongoDB when viewing the preview tab
    loadBrowserSandbox(currentProject);
}

function showPreviewIframe(url) {
    previewOverlay.classList.add('hidden');
    previewIframe.src = url;
    previewIframe.classList.remove('hidden');
    stopPreviewBtn.classList.remove('hidden');
    if (openPreviewExternalBtn) {
        openPreviewExternalBtn.href = url;
        openPreviewExternalBtn.classList.remove('hidden');
    }
}

function hidePreviewIframe() {
    previewOverlay.classList.remove('hidden');
    previewIframe.src = '';
    previewIframe.classList.add('hidden');
    stopPreviewBtn.classList.add('hidden');
    if (openPreviewExternalBtn) openPreviewExternalBtn.classList.add('hidden');
    previewStatusText.innerText = 'Preview is stopped. Click below to boot the in-browser sandbox.';
    startPreviewBtn.disabled = false;
    startPreviewText.innerText = 'Launch In-Browser Preview';
}

startPreviewBtn.onclick = () => {
    if (!currentProject) return;
    loadBrowserSandbox(currentProject);
};

stopPreviewBtn.onclick = () => {
    hidePreviewIframe();
};

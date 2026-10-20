{{/* Base name for all resources: <release>-<chart>, or just <release> if it already contains the chart name. */}}
{{- define "tic-tac-toe.fullname" -}}
{{- if contains .Chart.Name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "tic-tac-toe.serverName" -}}
{{- printf "%s-server" (include "tic-tac-toe.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "tic-tac-toe.clientName" -}}
{{- printf "%s-client" (include "tic-tac-toe.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "tic-tac-toe.imageTag" -}}
{{- .Values.image.tag | default .Chart.AppVersion -}}
{{- end -}}

{{- define "tic-tac-toe.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ include "tic-tac-toe.imageTag" . | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/* Selector labels; pass a dict with "ctx" (root context) and "component". */}}
{{- define "tic-tac-toe.selectorLabels" -}}
app.kubernetes.io/name: {{ .ctx.Chart.Name }}
app.kubernetes.io/instance: {{ .ctx.Release.Name }}
app.kubernetes.io/component: {{ .component }}
{{- end -}}

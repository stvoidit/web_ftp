package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
)

func humanReadableSize(n int64) (hrs string) {
	if n == 0 {
		return ""
	}
	const Mb = 1048576
	const GB = 1073741824
	switch {
	case n >= Mb && n < GB:
		hrs = fmt.Sprintf("%dMb", n/Mb)
	case n >= GB:
		hrs = fmt.Sprintf("%dGb", n/GB)
	}
	return
}

// FileEntity - ...
type FileEntity struct {
	Path   string `json:"path"`
	Name   string `json:"name"`
	IsDir  bool   `json:"isDir"`
	HrSize string `json:"hrSize,omitempty"`
	Size   int64  `json:"size,omitempty"`
}

func filesystem(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Method, r.RequestURI)
	const startDir = `/mnt/d`
	var qfe FileEntity
	if r.Method == http.MethodPost {
		if err := json.NewDecoder(r.Body).Decode(&qfe); err != nil {
			panic(err)
		}
		if !qfe.IsDir {
			w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", strconv.Quote(qfe.Name)))
			w.Header().Set("x-suggested-filename", qfe.Name)
			f, err := os.Open(path.Join(qfe.Path, qfe.Name))
			if err != nil {
				panic(err)
			}
			w.Header().Set("Content-Length", strconv.Itoa(int(qfe.Size)))
			defer f.Close()
			if _, err := io.Copy(w, f); err != nil {
				panic(err)
			}
			return
		}
	}
	var FPath = startDir
	if qfe.Path != "" && qfe.IsDir {
		FPath = path.Join(qfe.Path, qfe.Name)
	}

	dfs, err := os.ReadDir(FPath)
	if err != nil {
		panic(err)
	}

	var data = make([]FileEntity, len(dfs))
	for i, fe := range dfs {
		var hrsize string
		var size int64
		isDir := fe.IsDir()
		if !isDir {
			fi, err := fe.Info()
			if err != nil {
				continue
			}
			_size := fi.Size()
			hrsize = humanReadableSize(_size)
			size = _size
		}
		var fe = FileEntity{Name: fe.Name(), IsDir: isDir, Path: FPath, HrSize: hrsize, Size: size}
		data[i] = fe
	}
	w.Header().Add("content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]interface{}{"prevPath": FPath, "values": data}); err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/fs", filesystem)
	http.ListenAndServe(":9000", nil)
}

local name = vim.api.nvim_buf_get_name(0)

-- checkout vim.fn.jobstart
local output = vim.fn.system{ 'deno', '--help' }

vim.notify(output)


